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

      // Step 5: Request Glassdoor snapshot
      const glassdoorFilters = [
        {
          search_url: `${glassdoorSearchUrl}${encodeURIComponent(transformedCompany?.companyName || '')}`,
          max_search_results: 5,
        },
      ];

      const companySnapshotId = await requestSnapshotByUrlAndFilters(
        getGlassdoorCompanyInfoSnapshotUrl,
        glassdoorFilters,
      );

      console.info(
        `Successfully got Glassdoor snapshot ID ${companySnapshotId} for company ${transformedCompany.companyName}.`,
      );

      // Step 6: Enqueue Glassdoor snapshot ID for further processing
      const messageToGlassdoorQueue = {
        snapshotId: companySnapshotId,
        headquarters: transformedCompany.headquarters,
        companyName: transformedCompany.companyName,
        companyWebsiteUrl: transformedCompany.companyWebsiteUrl,
      };

      await sendMessageToQueue(glassdoorCompaniesQueueUrl, messageToGlassdoorQueue);
      console.info(
        `Enqueued Glassdoor snapshot to the Glassdoor companies queue: ${JSON.stringify(messageToGlassdoorQueue)}`,
      );
    } catch (error) {
      console.error(`Error processing snapshotId ${snapshotId}:`, error);
      throw error; // Let AWS handle retries and DLQ
    }
  });

  await Promise.all(promises);
  console.info('Batch processing complete.');
};
