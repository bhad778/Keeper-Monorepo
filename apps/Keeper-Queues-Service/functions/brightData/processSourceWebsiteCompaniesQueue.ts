import { SQSEvent } from 'aws-lambda';
import { JobSourceWebsiteEnum } from 'keeperTypes';
import { CompaniesService } from 'keeperServices';
import { glassdoorCompaniesQueueUrl, sourceWebsiteCompaniesQueueUrl } from 'keeperEnvironment';
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

const getGlassdoorCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j0bx501ockwldaqf&include_errors=true&type=discover_new&discover_by=keyword';

const glassdoorSearchUrl = 'https://www.glassdoor.com/Search/results.htm?keyword=';

// {
//   "snapshotId": "s_m4zl9nh512acix3jzh",
//   "sourceWebsite": "LinkedIn"
// }

// the companies queue holds messages that are just snapshotIds, and these snapshotIds hold data
export const handler = async (event: SQSEvent) => {
  const promises = event.Records.map(async record => {
    let snapshotId, sourceWebsite;

    const messageBody = JSON.parse(record.body);

    try {
      snapshotId = messageBody.snapshotId;
      sourceWebsite = messageBody.sourceWebsite;

      if (!snapshotId || !sourceWebsite) {
        console.error(
          `Skipping. This message from the queue is missing one of these: 
           snapshotId: ${snapshotId}, sourceWebsite: ${sourceWebsite}. Here is the message
           that was missing it- ${messageBody}`,
        );
        return; // Skip processing this message
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

      console.info(`Successfully fetched snapshot data for snapshotId: ${snapshotId}`);

      if (!Array.isArray(snapshotResultArray) || snapshotResultArray.length === 0) {
        console.error(`Snapshot data for snapshotId ${snapshotId} is empty or invalid.`);
        return;
      }

      const brightDataCompany = snapshotResultArray[0];

      if (!brightDataCompany || typeof brightDataCompany !== 'object') {
        console.error(`Invalid company data in snapshot for snapshotId ${snapshotId}.`);
        return;
      }

      const transformCompany = company => {
        if (sourceWebsite === JobSourceWebsiteEnum.Indeed) {
          return brightDataIndeedCompanyTransformer(company);
        } else if (sourceWebsite === JobSourceWebsiteEnum.LinkedIn) {
          return brightDataLinkedInCompanyTransformer(company);
        } else {
          return undefined;
        }
      };

      console.info(`Transforming company data for snapshotId: ${snapshotId}`);

      const transformedCompany = transformCompany(brightDataCompany);

      if (!transformedCompany) {
        console.info(
          `Skipping company as transformCompany returned undefined. Here is what the company
           was- ${brightDataCompany} and here is what sourceWebsite was- ${sourceWebsite}`,
        );
        return;
      }

      console.info(`Upserting company data for ${transformedCompany.companyName} in the database.`);

      // Step 3: Upsert company data in the MongoDB database
      const updateResponse = await CompaniesService.updateCompany({
        query: {
          $or: [
            { sourceWebsiteUrl: transformedCompany.sourceWebsiteUrl }, // Match by `sourceWebsiteUrl`
            { companyName: transformedCompany.companyName }, // Match by `companyName`
          ],
        },
        updateData: { ...transformedCompany, lastSourceWebsiteUpdate: new Date() },
        options: { upsert: true }, // Ensure upsert behavior
      });

      console.info(
        `Successfully upserted company data for ${transformedCompany.companyName}. Here is the response- ${updateResponse}`,
      );

      const glassdoorFilters = [
        {
          search_url: `${glassdoorSearchUrl}${encodeURIComponent(transformedCompany?.companyName as string)}`,
          max_search_results: 5,
        },
      ];

      // Step 4: Request a glassdoor snapshot for the company which will
      // return 5 results and we will have to determine if one matches
      const companySnapshotId = await requestSnapshotByUrlAndFilters(
        getGlassdoorCompanyInfoSnapshotUrl,
        glassdoorFilters,
      );

      console.info(
        `Successfully got glassdoor company snapshot ID ${companySnapshotId} for
         company ${transformedCompany.companyName}.`,
      );

      const messageToGlassdoorQueue = {
        snapshotId: companySnapshotId,
        headquarters: transformedCompany.headquarters,
        companyWebsiteUrl: transformedCompany.companyWebsiteUrl,
      };

      // Step 5: Send the company snapshot ID to the glassdoor companies queue
      await sendMessageToQueue(glassdoorCompaniesQueueUrl, messageToGlassdoorQueue);
      console.info(
        `Enqueued company snapshot with this data to glassdoor companies queue. - ${JSON.stringify(
          messageToGlassdoorQueue,
        )} `,
      );
    } catch (error) {
      console.error(`Error processing snapshotId ${snapshotId}:`, error);
      throw error; // Let AWS handle retries and DLQ
    }
  });

  await Promise.all(promises);
  console.info('Batch processing complete.');
};
