import Job from 'apps/Keeper-API/models/Job';
import { SQSEvent } from 'aws-lambda';
import { TJob, JobSourceWebsiteEnum } from 'keeperTypes';

import {
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  indeedJobTransformer,
  linkedInJobTransformer,
  requestSnapshotByUrlAndFilters,
  requeueMessage,
  requeueTimeout,
  sendMessageToQueue,
} from 'keeperUtils/brightDataUtils';
import { CompaniesService, JobsService } from 'packages/keeperServices';

const getLinkedInCompanySnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vikfnt1wgvvqz95w&include_errors=true';
const getIndeedCompanySnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7qekxkv2i7ve6hx1s&include_errors=true';

// this function pulls messages off the jobs queue, checks if the snapshot is ready, if it is it fetches the job data,
// if its not ready it requeues the message. If the company already exists in the db it skips it does nothing thus
// the message is removed from the queue. If that company doesnt already exist it requests a company snapshot from
// brightData and sends that snapshotId to the companies queue
export const handler = async (event: SQSEvent) => {
  // Ensure database connection is established

  const seenCompanyUrls = new Set<string>();
  const BATCH_SIZE = 10; // Number of jobs to process concurrently in a batch

  // There's typically only going to be 2 snapshots in the queue at a time, one from LinkedIn and one from Indeed
  const promises = event.Records.map(async record => {
    let snapshotId, sourceWebsite;
    const messageBody = JSON.parse(record.body);

    try {
      snapshotId = messageBody.snapshotId;
      sourceWebsite = messageBody.sourceWebsite;

      if (!snapshotId || !sourceWebsite) {
        console.error(
          `This message from the queue is missing one of these: snapshotId: ${snapshotId}, sourceWebsite: ${sourceWebsite}`,
        );
        return; // Skip processing this message
      }

      console.info(`Processing snapshotId: ${snapshotId}`);

      // Step 1: Check snapshot status
      const status = await checkSnapshotStatusById(snapshotId);
      if (status !== 'ready') {
        console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
        await requeueMessage(process.env.JOBS_QUEUE_URL, messageBody, requeueTimeout);
        return;
      }

      // Step 2: Fetch job data (array of jobs)
      const jobsArray = await fetchSnapshotArrayDataById(snapshotId);
      console.info(`Fetched ${jobsArray.length} jobs for snapshotId: ${snapshotId}`);

      const transformJob = job => {
        if (sourceWebsite === JobSourceWebsiteEnum.Indeed) {
          return indeedJobTransformer(job);
        } else if (sourceWebsite === JobSourceWebsiteEnum.LinkedIn) {
          return linkedInJobTransformer(job);
        } else {
          return undefined;
        }
      };

      const jobsToInsertInDB: TJob[] = [];

      // Function to process jobs in a single batch
      const processBatch = async batch => {
        console.info(`Processing batch: ${batch} of ${batch.length} jobs.`);
        await Promise.all(
          batch.map(async job => {
            // Transform jobs from Indeed or LinkedIn into our job schema
            const transformedJob = transformJob(job);

            if (!transformedJob) {
              console.info(`Skipping job as transformJob returned undefined.`);
              return;
            }

            if (!transformedJob.applyLink) {
              console.info(
                `This job doesnt have an applyLink. Skipping, but here is the
                 job were skipping- ${JSON.stringify(transformedJob)}.`,
              );
              return;
            }

            // Check if the job already exists in the database
            const jobPayload = {
              query: { applyLink: transformedJob.applyLink },
            };
            const jobExists = await JobsService.findJob(jobPayload); // Use unique identifier

            if (jobExists) {
              console.info(
                `Job with this apply link already exists. Skipping, but here is the
                 job were skipping- ${JSON.stringify(transformedJob)}.`,
              );
              return;
            }

            jobsToInsertInDB.push(transformedJob); // Add to batch for insertion

            // Check if company URL exists in the database
            const companyPayload = {
              query: { sourceWebsiteUrl: transformedJob.sourceWebsiteCompanyUrl },
            };
            const companyExists = await CompaniesService.findCompany(companyPayload);

            if (companyExists) {
              console.info(`Company with URL ${transformedJob.sourceWebsiteCompanyUrl} already exists. Skipping.`);
              return;
            }

            // this doesnt even add jobs to the db, also check companyurl

            const doesUrlMatchIndeed = transformedJob?.sourceWebsiteApplicationUrl
              ?.toLowerCase()
              .includes(`${JobSourceWebsiteEnum.Indeed}.com`.toLowerCase());
            const doesUrlMatchLinkedIn = transformedJob?.sourceWebsiteApplicationUrl
              ?.toLowerCase()
              .includes(`${JobSourceWebsiteEnum.LinkedIn}.com`.toLowerCase());

            const returnGetSnapshotUrl = () => {
              if (doesUrlMatchIndeed) {
                return getIndeedCompanySnapshotUrl;
              } else if (doesUrlMatchLinkedIn) {
                return getLinkedInCompanySnapshotUrl;
              } else {
                return undefined;
              }
            };

            const snapshotUrl = returnGetSnapshotUrl();

            if (!snapshotUrl) {
              console.info(`job.url is not from any known source websites i.e. Indeed or LinkedIn. Skipping.`);
              console.info('job that didnt have url from source website:', JSON.stringify(transformedJob));
              return;
            }

            if (!transformedJob.sourceWebsiteCompanyUrl) {
              console.info(
                `This job doesn't have a sourceWebsiteCompanyUrl with which to get a snapshot for the company data. Skipping.`,
              );
              console.info('job that didnt have sourceWebsiteCompanyUrl:', JSON.stringify(transformedJob));
              return;
            }

            if (seenCompanyUrls.has(transformedJob.sourceWebsiteCompanyUrl)) {
              console.info(`This company was already added by another job in this batch. Skipping.`);
              return;
            }

            seenCompanyUrls.add(transformedJob.sourceWebsiteCompanyUrl);

            const filters = [
              {
                url: transformedJob.sourceWebsiteCompanyUrl,
              },
            ];

            // Step 4: Request a snapshot for the company
            const companySnapshotId = await requestSnapshotByUrlAndFilters(snapshotUrl, filters);

            if (!companySnapshotId) {
              console.error(
                `requestSnapshotByUrlAndFilters did not return a valid companySnapshotId for URL: ${transformedJob.sourceWebsiteCompanyUrl}. Skipping.`,
              );
              return; // Skip further processing for this job
            }

            console.info(
              `Successfully got company snapshot data for snapshot- ${companySnapshotId} and for company URL- ${transformedJob.sourceWebsiteCompanyUrl}.`,
            );

            // Step 5: Send the company snapshot ID to the source website queue
            await sendMessageToQueue(process.env.SOURCE_WEBSITE_COMPANIES_QUEUE_URL, {
              snapshotId: companySnapshotId,
              sourceWebsite,
            });
            console.info(`Enqueued company snapshot ${companySnapshotId} to source website queue.`);

            if (!transformedJob.jobLocation) {
              console.info(`This job doesnt have a jobLocation. Skipping sending to geoLocationQueue, 
                but here is the job we skipped- ${JSON.stringify(transformedJob)}.`);
              return;
            }

            // Step 6: Send to geoLocation queue if job has jobLocation
            await sendMessageToQueue(process.env.GEOLOCATION_QUEUE_URL, {
              applyLink: transformedJob.applyLink,
              jobLocation: transformedJob.jobLocation,
            });
            console.info(`Enqueued ${transformedJob.applyLink} to geoLocation queue.`);
          }),
        );
      };

      // Step 3: Process jobs in batches
      for (let i = 0; i < jobsArray.length; i += BATCH_SIZE) {
        const batch = jobsArray.slice(i, i + BATCH_SIZE);
        await processBatch(batch);
      }

      // After processing all batches, validate jobs before inserting into the database
      if (jobsToInsertInDB.length > 0) {
        const validJobs: TJob[] = [];
        const invalidJobs: TJob[] = [];

        // Loop through each job to validate
        for (const jobData of jobsToInsertInDB) {
          // Create a new Job instance (if not already an instance)
          // TODO: dont use job model and hit the api like in the other functions
          const job = new Job(jobData);

          const validationError = job.validateSync();
          if (validationError) {
            console.error('Validation error for job:', jobData, validationError);
            invalidJobs.push(jobData); // Collect invalid jobs for logging or further processing
            continue; // Skip this job
          }

          validJobs.push(jobData); // Collect valid jobs
        }

        // Insert only the valid jobs into the database
        if (validJobs.length > 0) {
          try {
            console.info(`About to insert this many valid jobs: ${validJobs.length}`);

            const insertedJobs = await Job.insertMany(validJobs, { ordered: false });
            console.info(`Successfully inserted ${insertedJobs.length} jobs into the database.`);
          } catch (error) {
            console.error('Error inserting jobs into the database:', error);
          }
        } else {
          console.info('No valid jobs to insert into the database.');
        }

        // Log invalid jobs if any
        if (invalidJobs.length > 0) {
          console.info(`Skipped ${invalidJobs.length} invalid jobs due to validation errors.`);
          // Optionally, log the invalid jobs in detail
          console.log('invalidJobs:', invalidJobs);
        }
      } else {
        console.info('No new jobs to process.');
      }
    } catch (error) {
      console.error(`Error processing snapshotId ${snapshotId}:`, error);
      throw error; // Let AWS handle retries and DLQ
    }
  });

  await Promise.all(promises);
  console.info('Batch processing complete.');
};
