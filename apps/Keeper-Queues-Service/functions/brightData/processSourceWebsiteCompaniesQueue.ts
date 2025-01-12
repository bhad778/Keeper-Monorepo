import { SQSEvent } from 'aws-lambda';
import { JobSourceWebsiteEnum } from 'keeperTypes';
import { CompaniesService } from 'keeperServices';
import {
  crunchbaseCompaniesQueueUrl,
  glassdoorCompaniesQueueUrl,
  sourceWebsiteCompaniesQueueUrl,
} from 'keeperEnvironment';
import {
  brightDataIndeedCompanyTransformer,
  brightDataLinkedInCompanyTransformer,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  requestSnapshotByUrlAndFilters,
  requeueMessage,
  requeueTimeout,
  sendMessageToQueue,
} from 'keeperUtils/brightDataUtils';
import { extractErrorMessage } from 'keeperUtils';
import pLimit from 'p-limit';
import {
  getCrunchbaseCompanyInfoSnapshotUrl,
  getGlassdoorCompanyInfoSnapshotUrl,
  glassdoorSearchUrl,
} from 'keeperConstants';

// {
//   "snapshotId": "s_m5ss48mo29h1ih9kiq",
//   "sourceWebsite": "LinkedIn"
// },
// {
//   "snapshotId": "s_m5ss48lv1v239spx",
//   "sourceWebsite": "Indeed"
// }

// the companies queue holds messages that are just snapshotIds, and these snapshotIds hold data
// this queue gets blasted with many
export const handler = async (event: SQSEvent) => {
  const MAX_MESSAGES_TO_PROCESS = 50; // Limit the number of messages processed per invocation
  const MAX_CONCURRENT_REQUESTS = 80; // Limit the number of concurrent BrightData requests

  // Split messages into those to process and those to requeue
  const messagesToProcess = event.Records.slice(0, MAX_MESSAGES_TO_PROCESS);
  const messagesToRequeue = event.Records.slice(MAX_MESSAGES_TO_PROCESS);

  const limit = pLimit(MAX_CONCURRENT_REQUESTS);

  // Process up to 80 messages
  const promises = messagesToProcess.map(async record => {
    limit(async () => {
      let snapshotId: string | undefined, sourceWebsite: string | undefined;

      try {
        const messageBody = JSON.parse(record.body);

        snapshotId = messageBody.snapshotId;
        sourceWebsite = messageBody.sourceWebsite;

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
          await requeueMessage(sourceWebsiteCompaniesQueueUrl, messageBody, requeueTimeout);
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
        const updateResponse = await CompaniesService.updateCompany({
          query: {
            $or: [
              { sourceWebsiteUrl: transformedCompany.sourceWebsiteUrl },
              { companyName: transformedCompany.companyName },
            ],
          },
          updateData: { ...transformedCompany, lastSourceWebsiteUpdate: new Date() },
          options: { upsert: true },
        });

        if (!updateResponse || !updateResponse.success) {
          console.error(`Failed to upsert company data for ${transformedCompany.companyName}.`);
          return;
        }

        console.info(`Successfully upserted company data for ${transformedCompany.companyName}.`);

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
            console.warn(
              `Crunchbase snapshot request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`,
            );
            await requeueMessage(sourceWebsiteCompaniesQueueUrl, messageBody, requeueTimeout);
            return;
          } else {
            console.error(`Failed to request Crunchbase snapshot:`, error);
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
            console.warn(
              `Crunchbase snapshot request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`,
            );
            await requeueMessage(sourceWebsiteCompaniesQueueUrl, messageBody, requeueTimeout);
            return;
          } else {
            console.error(`Failed to request Crunchbase snapshot:`, error);
            throw error; // Let AWS handle retries for other errors
          }
        }
      } catch (error) {
        console.error(`Error processing snapshotId ${snapshotId}:`, error);
        throw error; // Let AWS handle retries and DLQ
      }
    });
  });

  await Promise.all(promises);

  // Requeue remaining messages
  const requeuePromises = messagesToRequeue.map(async record => {
    try {
      const messageBody = JSON.parse(record.body);
      console.info(`Requeuing message: ${JSON.stringify(messageBody)}`);

      const batchRequeueTimeout = 300; // Requeue after 5 minutes
      await requeueMessage(sourceWebsiteCompaniesQueueUrl, messageBody, batchRequeueTimeout);
    } catch (error) {
      console.error(`Failed to requeue message: ${record.body}`, error);
    }
  });

  await Promise.all(requeuePromises);

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
