import { SQSEvent } from 'aws-lambda';
import { JobSourceWebsiteEnum } from 'keeperTypes';
import { CompaniesService, JobsService, TUpdateJobPayload } from 'keeperServices';
import { sendMessageToQueue, extractErrorMessage } from 'keeperUtils/backendUtils';
import {
  brightDataIndeedCompanyTransformer,
  brightDataLinkedInCompanyTransformer,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  requestSnapshotByUrlAndFilters,
  snapshotNotReadyRequeueTimeout,
  staggerTimeout,
} from 'keeperUtils/brightDataUtils';
import {
  getCrunchbaseCompanyInfoSnapshotUrl,
  getGlassdoorCompanyInfoSnapshotUrl,
  glassdoorSearchUrl,
} from 'keeperConstants';

const sourceWebsiteCompaniesQueueUrl = process.env.VITE_SOURCE_WEBSITE_COMPANIES_QUEUE_URL as string;
const glassdoorCompaniesQueueUrl = process.env.VITE_GLASSDOOR_COMPANIES_QUEUE_URL as string;
const crunchbaseCompaniesQueueUrl = process.env.VITE_CRUNCHBASE_COMPANIES_QUEUE_URL as string;

// this snapshot will yield
// {
//   "snapshotId": "s_m5kgyfxs1km7azb6yh",
//   "sourceWebsite": "LinkedIn",
//   "jobId": "2342342",
// }

// the companies queue holds messages that are just snapshotIds, and these snapshotIds hold data
export const handler = async (event: SQSEvent) => {
  const promises = event.Records.map(async record => {
    let snapshotId: string | undefined, sourceWebsite: string | undefined, jobId: string | undefined;

    try {
      const messageBody = JSON.parse(record.body);

      snapshotId = messageBody.snapshotId;
      sourceWebsite = messageBody.sourceWebsite;
      jobId = messageBody.jobId;

      console.info(`Processing message with this data- ${JSON.stringify(messageBody)}`);

      if (!snapshotId || !sourceWebsite) {
        console.error(
          `Skipping. Missing required fields: snapshotId (${snapshotId}), sourceWebsite (${sourceWebsite}). Message: ${JSON.stringify(
            messageBody,
          )}`,
        );
        return;
      }

      console.info(`Processing snapshotId: ${snapshotId}`);

      // Step 1: Check snapshot status
      const status = await checkSnapshotStatusById(snapshotId);
      if (status !== 'ready') {
        console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
        await sendMessageToQueue(sourceWebsiteCompaniesQueueUrl, messageBody, snapshotNotReadyRequeueTimeout);
        return;
      }

      // Step 2: Fetch company data from BrightData
      const snapshotResultArray = await fetchSnapshotArrayDataById(snapshotId);

      if (!Array.isArray(snapshotResultArray) || snapshotResultArray.length === 0) {
        console.error(`Snapshot data for snapshotId ${snapshotId} is empty or invalid.`);
        return;
      }

      const brightDataCompany = snapshotResultArray[0];
      if (!brightDataCompany || typeof brightDataCompany !== 'object') {
        console.error(`Invalid company data in snapshot for snapshotId ${snapshotId}.`);
        return;
      }

      // Step 3: Transform company data
      console.info(`Transforming company data for snapshotId: ${snapshotId}`);
      const transformedCompany =
        sourceWebsite === JobSourceWebsiteEnum.Indeed
          ? brightDataIndeedCompanyTransformer(brightDataCompany)
          : sourceWebsite === JobSourceWebsiteEnum.LinkedIn
          ? brightDataLinkedInCompanyTransformer(brightDataCompany)
          : undefined;

      if (!transformedCompany) {
        console.info(`TransformCompany returned undefined. Skipping. Company: ${brightDataCompany}`);
        return;
      }

      console.info(`Upserting company data for ${transformedCompany.companyName} into the database.`);

      // Step 4: Upsert company data into the database
      const updateCompanyResponse = await CompaniesService.updateCompany({
        query: {
          $or: [
            { sourceWebsiteUrl: transformedCompany.sourceWebsiteUrl },
            { companyName: transformedCompany.companyName },
          ],
        },
        updateData: { ...transformedCompany, lastSourceWebsiteUpdate: new Date() },
        options: { upsert: true },
      });

      if (!updateCompanyResponse || !updateCompanyResponse.success) {
        console.error(`Failed to upsert company data for ${transformedCompany.companyName}.`);
        return;
      }

      console.info(`Successfully upserted company data for ${transformedCompany.companyName}.`);

      const updateJobPayload: TUpdateJobPayload = {
        query: { _id: jobId },
        updateData: { companyId: updateCompanyResponse.data ? updateCompanyResponse?.data._id : '' },
      };

      // Update the job in the database with geolocation data
      const updateJobResponse = await JobsService.updateJob(updateJobPayload);

      if (!updateJobResponse || !updateJobResponse.success) {
        console.error(
          `Failed to update companyId in job for jobId ${jobId} with this updateCompanyResponse.data ${JSON.stringify(
            updateCompanyResponse?.data,
          )}.`,
        );
        return;
      }

      console.info(`Successfully updated companyId in job for jobId ${jobId}.`);

      try {
        // Step 5: Request Glassdoor snapshot
        const glassdoorFilters = [
          {
            search_url: `${glassdoorSearchUrl}${encodeURIComponent(transformedCompany?.companyName || '')}`,
            max_search_results: 5,
          },
        ];

        const glassDoorCompanySnapshotId = await requestSnapshotByUrlAndFilters(
          getGlassdoorCompanyInfoSnapshotUrl,
          glassdoorFilters,
        );

        console.info(
          `Successfully got Glassdoor snapshot ID ${glassDoorCompanySnapshotId} for company ${transformedCompany.companyName}.`,
        );

        // Step 6: Enqueue Glassdoor snapshot ID for further processing
        const messageToGlassdoorAndCrunchbaseQueues = {
          headquarters: transformedCompany.headquarters,
          companyName: transformedCompany.companyName,
          companyWebsiteUrl: transformedCompany.companyWebsiteUrl,
        };

        await sendMessageToQueue(glassdoorCompaniesQueueUrl, {
          ...messageToGlassdoorAndCrunchbaseQueues,
          snapshotId: glassDoorCompanySnapshotId,
        });

        console.info(
          `Enqueued Glassdoor snapshot to the Glassdoor companies queue: ${JSON.stringify(
            messageToGlassdoorAndCrunchbaseQueues,
          )}`,
        );
      } catch (error) {
        const errorMessage = extractErrorMessage(error);

        if (errorMessage.includes('too many running jobs')) {
          console.warn(`Brightdata request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`);
          await sendMessageToQueue(sourceWebsiteCompaniesQueueUrl, messageBody, staggerTimeout);
          return;
        } else {
          console.error(`Failed to request snapshot:`, error);
          throw error; // Let AWS handle retries for other errors
        }
      }

      try {
        const crunchbaseFilters = [{ keyword: transformedCompany.companyName }];

        const crunchbaseSnapshotId = await requestSnapshotByUrlAndFilters(
          getCrunchbaseCompanyInfoSnapshotUrl,
          crunchbaseFilters,
        );

        console.info(
          `Successfully got crunchbase company snapshot ID ${crunchbaseSnapshotId} for
         company ${transformedCompany.companyName}.`,
        );

        const messageToGlassdoorAndCrunchbaseQueues = {
          headquarters: transformedCompany.headquarters,
          companyName: transformedCompany.companyName,
          companyWebsiteUrl: transformedCompany.companyWebsiteUrl,
        };

        await sendMessageToQueue(crunchbaseCompaniesQueueUrl, {
          ...messageToGlassdoorAndCrunchbaseQueues,
          snapshotId: crunchbaseSnapshotId,
        });
      } catch (error) {
        const errorMessage = extractErrorMessage(error);

        if (errorMessage.includes('too many running jobs')) {
          console.warn(`Brightdata request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`);
          await sendMessageToQueue(sourceWebsiteCompaniesQueueUrl, messageBody, staggerTimeout);
          return;
        } else {
          console.error(`Failed to request snapshot:`, error);
          throw error; // Let AWS handle retries for other errors
        }
      }
    } catch (error) {
      console.error(`Error processing snapshotId ${snapshotId}:`, error);
      throw error; // Let AWS handle retries and DLQ
    }
  });

  await Promise.all(promises);
  console.info('Batch processing complete.');
};

// curl -H "Authorization: Bearer de4cc20e-bc8a-43be-bcfb-1a223a598a4a" -H "Content-Type: application/json" -d '[{"keyword":"Plaid"}]' "https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vijqt9jfj7olije&include_errors=true&type=discover_new&discover_by=keyword"

// I think when matching on company name, it should say if one of the company names is 1 word, it should see if the other one
// includes that word by itself with spaces around it. For example in my db, jobs via dice would match dice, expedia group would
// match expedia. It also needs to change dashes into spaces

// maybe we just do manual checks for jobs via dice etc cus theres gonna be a lot of those, and it just says this company wants to remain anonymous

// Prelim - in cb
// s_m5sqcruyvmgbqpri5 - worked when I ran it again

// Vignesh Technological Solutions - in cb
// s_m5sqe7h91qvkgm9qia - worked when I ran it again

// Rvo Health - in cb
// s_m5sqfswl2prh4siney - worked when I ran it again

// Unity Technologies - in cb
// s_m5sqike53dhkk3qbs - worked when I ran it again

// Motherduck - in cb
// s_m5sqmja62pd049yzxc - worked when I ran it again

// Plaid - in cb
// s_m5sqqd5s5c3gjdx88 - worked when I ran it again

// You have too many running jobs for this dataset. Please wait until some of them finish or consider combining multiple inputs into a single request. Running jobs: 100>=100
