import { SQSEvent } from 'aws-lambda';
import { TBrightDataCrunchbaseCompany } from 'keeperTypes';
import { normalizeLocation, normalizeUrl } from 'keeperUtils';
import { CompaniesService } from 'keeperServices';

import {
  brightDataCrunchbaseCompanyTransformer,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  normalizeCompanyName,
  requeueMessage,
  requeueTimeout,
} from 'keeperUtils/brightDataUtils';
import { crunchbaseCompaniesQueueUrl } from 'keeperEnvironment';

export const handler = async (event: SQSEvent) => {
  try {
    console.info('Starting batch processing for Crunchbase snapshots.');

    const promises = event.Records.map(async record => {
      let snapshotId, companyName, headquarters, companyWebsiteUrl, retries;

      const messageBody = JSON.parse(record.body);

      try {
        snapshotId = messageBody.snapshotId;
        companyName = normalizeCompanyName(messageBody.companyName);
        headquarters = normalizeLocation(messageBody.headquarters);
        companyWebsiteUrl = normalizeUrl(messageBody.companyWebsiteUrl, true);
        retries = messageBody.retries || 0;

        if (!snapshotId) {
          console.error(
            `This message from the queue is missing a snapshotId. Skipping, but here is the message: ${JSON.stringify(
              messageBody,
            )}`,
          );
          throw new Error('Missing snapshotId in the message');
        }

        console.info(`Processing Crunchbase snapshotId: ${snapshotId} for company: ${companyName}`);

        // Step 1: Check snapshot status
        const status = await checkSnapshotStatusById(snapshotId);
        if (status !== 'ready') {
          console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
          await requeueMessage(crunchbaseCompaniesQueueUrl, messageBody, requeueTimeout);
          return;
        }

        console.info(`Snapshot ${snapshotId} is ready.`);

        // Step 2: Fetch Crunchbase data
        const crunchbaseResults: TBrightDataCrunchbaseCompany[] = await fetchSnapshotArrayDataById(snapshotId);
        console.info(`Fetched ${crunchbaseResults.length} Crunchbase results for snapshotId: ${snapshotId}`);

        // Step 3: Match Crunchbase data with the current company
        const matchedCompany = crunchbaseResults.find(result => {
          const normalizedCrunchbaseWebsite = normalizeUrl(result.website || '', true);
          return (
            (normalizedCrunchbaseWebsite === companyWebsiteUrl && companyWebsiteUrl != null) ||
            (normalizeCompanyName(result.name) === companyName && companyName != null)
          );
        });

        if (!matchedCompany) {
          console.info(
            `No matching Crunchbase company found for ${companyWebsiteUrl}. Skipping. But here is the Crunchbase data fetched: ${JSON.stringify(
              crunchbaseResults,
            )}.`,
          );
          throw new Error('No matching Crunchbase company found');
        }

        console.info(
          `Matched Crunchbase company found and here is the matched company: ${JSON.stringify(
            matchedCompany,
          )}. Transforming data.`,
        );

        const transformedCompany = brightDataCrunchbaseCompanyTransformer(matchedCompany);

        if (!transformedCompany) {
          console.info(`Transformed company data is undefined. Skipping update.`);
          return;
        }

        console.info(
          `Transformed company data for ${companyWebsiteUrl}: here is the data: ${JSON.stringify(transformedCompany)}`,
        );

        // Step 4: Update company data in MongoDB
        const updateResponse = await CompaniesService.updateCompany({
          query: {
            $or: [{ companyWebsiteUrl: companyWebsiteUrl }, { companyName: companyName, headquarters: headquarters }],
          },
          updateData: { ...transformedCompany, lastCrunchbaseCompanyUpdate: new Date() },
        });

        if (updateResponse.success) {
          console.info(`Successfully updated Crunchbase data for company: ${companyWebsiteUrl}`);
        } else {
          console.info(
            `No matching company found in DB for URL: ${companyWebsiteUrl} and headquarters: ${headquarters}`,
          );
        }
      } catch (error) {
        console.error(`Error processing Crunchbase snapshotId ${snapshotId} for company ${companyWebsiteUrl}:`, error);

        if (retries < 3) {
          console.info(`Retrying Crunchbase snapshot for ${messageBody.companyName}. Retry count: ${retries + 1}`);
          const newMessageBody = { ...messageBody, retries: retries + 1 };
          await requeueMessage(crunchbaseCompaniesQueueUrl, newMessageBody, requeueTimeout);
        } else {
          console.error(
            `Max retries reached for Crunchbase snapshotId ${snapshotId} and company ${messageBody.companyName}. Skipping.`,
          );
        }
      }
    });

    await Promise.all(promises);
    console.info('Batch processing for Crunchbase snapshots completed successfully.');
  } catch (error) {
    console.error('Critical error in Crunchbase queue handler:', error);
    throw new Error('Failed to process Crunchbase queue');
  }
};
