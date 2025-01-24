import { SQSEvent } from 'aws-lambda';
import { TBrightDataCrunchbaseCompany } from 'keeperTypes';
import {
  extractErrorMessage,
  normalizeLocation,
  normalizeUrl,
  sendMessageToQueue,
  normalizeCompanyName,
} from 'keeperUtils/backendUtils';
import {
  brightDataCrunchbaseCompanyTransformer,
  requestSnapshotByUrlAndFilters,
  snapshotNotReadyRequeueTimeout,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
} from 'keeperUtils/brightDataUtils';

import { CompaniesService } from 'keeperServices';
import { crunchbaseCompaniesQueueUrl } from 'keeperEnvironment';
import { getCrunchbaseCompanyInfoSnapshotUrl } from 'keeperConstants';

// {
//   "snapshotId": "s_m5sqcruyvmgbqpri5",
//   "companyName": "Prelim",
//   "headquarters": null,
//   "companyWebsiteUrl": null,
//   "retries": 0
// }

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

        console.info(`Processing message with this data- ${JSON.stringify(messageBody)}`);

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
          await sendMessageToQueue(crunchbaseCompaniesQueueUrl, messageBody, snapshotNotReadyRequeueTimeout);
          return;
        }

        console.info(`Snapshot ${snapshotId} is ready.`);

        // Step 2: Fetch Crunchbase data
        const crunchbaseResults: TBrightDataCrunchbaseCompany[] = await fetchSnapshotArrayDataById(snapshotId);
        console.info(`Fetched ${crunchbaseResults.length} Crunchbase results for snapshotId: ${snapshotId}`);

        // Step 3: Match Crunchbase data with the current company
        const matchedCompany = crunchbaseResults.find(result => {
          // Normalize the company's website
          const normalizedCrunchbaseCompanyWebsite = normalizeUrl(result.website || '', true);

          // Normalize the company's name
          const normalizedCrunchbaseCompanyName = normalizeCompanyName(result.name);

          // Get the company name from Crunchbase URL
          const match = result?.url ? result.url.match(/\/organization\/([^/]+)/) : null;
          const crunchbaseCompanyNameFromUrl = match ? match[1] : null;

          // Normalize the headquarters location
          const normalizedCrunchbaseHeadquarters = normalizeLocation(result.address);

          // Create the dashed version of the company name
          const companyNameDashed = companyName?.toLowerCase().split(' ').join('-');

          return (
            // Match by companyWebsiteUrl
            (companyWebsiteUrl != null && normalizedCrunchbaseCompanyWebsite === companyWebsiteUrl) ||
            // Match by companyName and headquarters
            (companyName != null &&
              normalizedCrunchbaseCompanyName === companyName &&
              headquarters != null &&
              normalizedCrunchbaseHeadquarters) ||
            // Match when headquarters and companyWebsiteUrl are null but names match
            (companyWebsiteUrl == null && headquarters == null && normalizedCrunchbaseCompanyName === companyName) ||
            // Match by dashed company name in URL
            companyNameDashed === crunchbaseCompanyNameFromUrl
          );
        });

        if (!matchedCompany) {
          console.info(
            `No matching Crunchbase company found for ${companyName}. Skipping. But here is the Crunchbase data fetched: ${JSON.stringify(
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
          `Transformed company data for ${companyName}: here is the data: ${JSON.stringify(transformedCompany)}`,
        );

        // get the company name from crunchbase/organization/company-name
        const match = matchedCompany?.url.match(/\/organization\/([^/]+)/);
        const crunchbaseCompanyNameFromUrl = match ? match[1] : null;

        const orConditions: any = [
          {
            // If companyWebsiteUrl is not null and matches
            $and: [{ companyWebsiteUrl: { $ne: null } }, { companyWebsiteUrl: companyWebsiteUrl }],
          },
          {
            // If companyName is not null and matches
            $and: [{ companyName: { $ne: null } }, { companyName: companyName }],
          },
        ];

        // Add the condition for dashes in company name only if crunchbaseCompanyNameFromUrl is not null
        if (crunchbaseCompanyNameFromUrl) {
          const normalizedCrunchbaseCompanyName = normalizeCompanyName(crunchbaseCompanyNameFromUrl);

          orConditions.push({
            companyName: {
              $regex: `^${normalizedCrunchbaseCompanyName?.replace(/\s+/g, '\\s*')}$`, // disregard spaces when matching
              $options: 'i', // Case-insensitive match
            },
          });
        }

        // Step 4: Update company data in MongoDB
        const updateResponse = await CompaniesService.updateCompany({
          query: {
            $or: orConditions,
          },
          updateData: { ...transformedCompany, lastCrunchbaseCompanyUpdate: new Date() },
        });

        if (updateResponse.success) {
          console.info(`Successfully updated Crunchbase data for company: ${companyName}`);
        } else {
          console.info(
            `No matching company found in DB. It failed to match one of these- companyName: ${companyName} or companyWebsiteUrl: ${companyWebsiteUrl}`,
          );
        }
      } catch (error) {
        console.error(`Error processing Crunchbase snapshotId ${snapshotId} for company ${companyWebsiteUrl}:`, error);

        if (retries < 1) {
          try {
            console.info(`Retrying Crunchbase snapshot for ${messageBody.companyName}. Retry count: ${retries + 1}`);

            // const crunchbaseFilters = [{ url: `https://www.crunchbase.com/organization/${formattedCompanyName}` }];
            const crunchbaseFilters = [{ keyword: companyName }];

            const crunchbaseSnapshotId = await requestSnapshotByUrlAndFilters(
              getCrunchbaseCompanyInfoSnapshotUrl,
              crunchbaseFilters,
            );

            const newMessageBody = { ...messageBody, snapshotId: crunchbaseSnapshotId, retries: retries + 1 };
            await sendMessageToQueue(crunchbaseCompaniesQueueUrl, newMessageBody, snapshotNotReadyRequeueTimeout);
          } catch (error) {
            const errorMessage = extractErrorMessage(error);

            if (errorMessage.includes('too many running jobs')) {
              console.warn(`Brightdata request hit rate limit. Requeuing message: ${JSON.stringify(messageBody)}`);
              await sendMessageToQueue(crunchbaseCompaniesQueueUrl, messageBody, snapshotNotReadyRequeueTimeout);
              return;
            } else {
              console.error(`Failed to request snapshot:`, error);
              throw error; // Let AWS handle retries for other errors
            }
          }
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
