import { SQSEvent } from 'aws-lambda';
import { JobsService, CompaniesService, ChatGPTService } from 'keeperServices';
import { sendMessageToQueue, extractErrorMessage } from 'keeperUtils/backendUtils';
import { snapshotNotReadyRequeueTimeout, requestSnapshotByUrlAndFilters } from 'keeperUtils/brightDataUtils';
import { geoLocationQueueUrl, jobsQueueUrl, sourceWebsiteCompaniesQueueUrl } from 'keeperEnvironment';
import { TJob, JobSourceWebsiteEnum } from 'keeperTypes';
import { getIndeedCompanySnapshotUrl, getLinkedInCompanySnapshotUrl } from 'keeperConstants';

import { massageJobDataPrompt } from '../../chatGPTPrompts';

// example message-
// {
//     "job": a transformed job object,
//     "sourceWebsite": "LinkedIn"
// }
export const handler = async (event: SQSEvent) => {
  const promises = event.Records.map(async record => {
    const messageBody = JSON.parse(record.body) as { job: TJob; sourceWebsite: JobSourceWebsiteEnum };
    const { job, sourceWebsite } = messageBody;

    if (!job || !job.applyLink) {
      console.error(`Invalid job message: ${JSON.stringify(job)}`);
      return;
    }

    try {
      console.info(`Processing job: ${job.companyName}`);

      // Step 1: Check if the job already exists in the database
      const jobExists = await JobsService.findJob({ query: { applyLink: job.applyLink } });
      if (jobExists.success && jobExists.data) {
        console.info(`Job already exists: ${job.applyLink}. Skipping.`);
        return;
      }

      try {
        // Call ChatGPTService and get the response
        const response = await ChatGPTService.handleChatGPTRequest(massageJobDataPrompt(job.jobSummary, job.jobTitle));

        // Check if the response indicates success
        if (response.success && response.data) {
          // Parse the `data` field, which contains the stringified JSON object
          const parsedDetails = JSON.parse(response.data);

          console.info(`Extracted details: ${JSON.stringify(parsedDetails)}`);

          // Add the extracted details to the job object
          job.benefits = parsedDetails.benefits;
          job.compensation = parsedDetails.compensation;
          job.formattedCompensation = parsedDetails.formattedCompensation;
          job.locationFlexibility = parsedDetails.locationFlexibility;
          job.jobSummary = parsedDetails.jobSummary;
        } else {
          console.error(`Failed to extract details. Response: ${JSON.stringify(response)}`);
          // Handle failure case (e.g., log error, skip job processing, etc.)
        }
      } catch (error) {
        console.error(`Error processing ChatGPT response: ${error}`);
        // Handle error case (e.g., log error, requeue message, etc.)
      }

      console.info(
        `Successfully extracted details and addd them to job object. Heres the job data before we add it to the DB: ${JSON.stringify(
          job,
        )}`,
      );

      // Step 3: Add the job to the database
      await JobsService.addJob({ jobs: [job] });

      console.info(`Added job to the database for company: ${job.companyName}`);

      // Step 3: Check if the company exists in the database
      const companyExists = await CompaniesService.findCompany({
        query: { sourceWebsiteUrl: job.sourceWebsiteCompanyUrl },
      });

      if (!companyExists.success) {
        console.info(`Company does not exist in DB currently. Proceeding to request snapshot.`);

        // Step 4: Determine the snapshot URL based on the source website
        const doesUrlMatchIndeed = job.sourceWebsiteApplicationUrl
          ?.toLowerCase()
          .includes(`${JobSourceWebsiteEnum.Indeed}.com`.toLowerCase());
        const doesUrlMatchLinkedIn = job.sourceWebsiteApplicationUrl
          ?.toLowerCase()
          .includes(`${JobSourceWebsiteEnum.LinkedIn}.com`.toLowerCase());

        const getSnapshotUrl = (): string | undefined => {
          if (doesUrlMatchIndeed) return getIndeedCompanySnapshotUrl;
          if (doesUrlMatchLinkedIn) return getLinkedInCompanySnapshotUrl;
          return undefined;
        };

        const snapshotUrl = getSnapshotUrl();

        if (!snapshotUrl) {
          console.info(`Url does not match known source websites, LinkedIn, Indeed, etc. Skipping.`);
          return;
        }

        if (!job.sourceWebsiteCompanyUrl) {
          console.info(`Job does not have a sourceWebsiteCompanyUrl. Skipping.`);
          return;
        }

        try {
          // Step 5: Request a snapshot for the company
          const filters = [{ url: job.sourceWebsiteCompanyUrl }];
          const companySnapshotId = await requestSnapshotByUrlAndFilters(snapshotUrl, filters);

          if (!companySnapshotId) {
            console.error(`Failed to get a valid companySnapshotId for URL: ${job.sourceWebsiteCompanyUrl}. Skipping.`);
            return;
          }

          console.info(`Successfully got company snapshotId: ${companySnapshotId}`);

          // Step 6: Send the company snapshot ID to the processSourceWebsiteQueue
          const sourceWebsiteQueueMessage = {
            snapshotId: companySnapshotId,
            sourceWebsite,
          };

          await sendMessageToQueue(sourceWebsiteCompaniesQueueUrl, sourceWebsiteQueueMessage);
          console.info(
            `Enqueued company snapshot to processSourceWebsiteQueue: ${JSON.stringify(sourceWebsiteQueueMessage)}`,
          );
        } catch (error) {
          const errorMessage = extractErrorMessage(error);

          if (errorMessage.includes('too many running jobs')) {
            console.warn(
              `Brightdata snapshot request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`,
            );
            await sendMessageToQueue(jobsQueueUrl, messageBody, snapshotNotReadyRequeueTimeout);
            return;
          } else {
            console.error(`Failed to request snapshot:`, error);
            throw error; // Let AWS handle retries for other errors
          }
        }
      }

      // Step 7: Enqueue job to GeoLocation Queue if it has a jobLocation
      if (job.jobLocation) {
        await sendMessageToQueue(geoLocationQueueUrl, {
          applyLink: job.applyLink,
          jobLocation: job.jobLocation,
        });
        console.info(`Enqueued job to GeoLocation Queue: ${job.applyLink}`);
      }
    } catch (error) {
      console.error(`Error processing job: ${job.applyLink}`, error);
      throw error; // Let AWS handle retries
    }
  });

  await Promise.all(promises);
};
