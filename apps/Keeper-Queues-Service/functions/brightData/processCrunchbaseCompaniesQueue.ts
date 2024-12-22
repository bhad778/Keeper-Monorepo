import { SQSEvent } from 'aws-lambda';
import { TBrightDataGlassdoorCompany } from 'keeperTypes';
import { normalizeLocation, normalizeUrl } from 'keeperUtils';
import { CompaniesService } from 'keeperServices';
import {
  brightDataGlassdoorCompanyTransformer,
  checkSnapshotStatusById,
  fetchSnapshotArrayDataById,
  normalizeCompanyName,
  requestSnapshotByUrlAndFilters,
  requeueMessage,
  requeueTimeout,
  sendMessageToQueue,
  transformGlassdoorUrlToReviews,
} from 'keeperUtils/brightDataUtils';
import { glassdoorReviewsQueueUrl, glassdoorCompaniesQueueUrl } from 'keeperEnvironment';

const glassdoorReviewsSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j1po0921hbu0ri1z&include_errors=true';

export const handler = async (event: SQSEvent) => {
  try {
    console.info('Starting batch processing for Glassdoor snapshots.');

    // Ensure database connection is established

    const promises = event.Records.map(async record => {
      let snapshotId, headquarters, companyWebsiteUrl, companyName;

      const messageBody = JSON.parse(record.body);

      try {
        snapshotId = messageBody.snapshotId;
        companyName = normalizeCompanyName(messageBody.companyName);
        headquarters = normalizeLocation(messageBody.headquarters);
        companyWebsiteUrl = normalizeUrl(messageBody.companyWebsiteUrl, true);

        if (!snapshotId) {
          console.error(
            `This message from the queue is missing a snapshotId. Skipping, but here is the message: ${JSON.stringify(
              messageBody,
            )}`,
          );
          throw new Error('Missing snapshotId in the message');
        }

        if (!companyWebsiteUrl && (!headquarters || !companyName)) {
          console.error(
            `This message is missing a required field. You must have a companyWebsiteUrl or both headquarters and companyName. Skipping, but here is the message: ${JSON.stringify(
              messageBody,
            )}`,
          );
          return; // Skip processing this message
        }

        console.info(`Processing Glassdoor snapshotId: ${snapshotId} for companyWebsiteUrl: ${companyWebsiteUrl}`);

        // Step 1: Check snapshot status
        const status = await checkSnapshotStatusById(snapshotId);
        if (status !== 'ready') {
          console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
          await requeueMessage(glassdoorCompaniesQueueUrl, messageBody, requeueTimeout);
          return;
        }

        console.info(`Snapshot ${snapshotId} is ready.`);

        // Step 2: Fetch Crunchbase data
        const crunchbaseResults: TBrightDataGlassdoorCompany[] = await fetchSnapshotArrayDataById(snapshotId);
        console.info(`Fetched ${crunchbaseResults.length} Glassdoor results for snapshotId: ${snapshotId}`);

        // Step 3: Match Glassdoor data with the current company
        const matchedCompany = crunchbaseResults.find(result => {
          if (result.error || result.error_code) {
            console.info(`Error in Glassdoor result: ${JSON.stringify(result)}. Skipping this result.`);
            return false; // Skip this result
          }

          const normalizedGlassdoorHeadquarters = normalizeLocation(result.details_headquarters || '');
          const normalizedGlassdoorWebsite = normalizeUrl(result.details_website || '', true);

          return (
            (normalizedGlassdoorHeadquarters === headquarters && headquarters != null) ||
            (normalizedGlassdoorWebsite === companyWebsiteUrl && companyWebsiteUrl != null)
          );
        });

        if (!matchedCompany) {
          console.info(`No matching Glassdoor company found for ${companyWebsiteUrl}. Skipping. But here
            is the Glassdoor data fetched: ${JSON.stringify(crunchbaseResults)}.`);
          return;
        }

        console.info(
          `Matched Glassdoor company found and heres the matched company- ${JSON.stringify(
            matchedCompany,
          )}. Transforming data.`,
        );

        const transformedCompany = brightDataGlassdoorCompanyTransformer(matchedCompany);

        if (!transformedCompany) {
          console.info(`transformedCompany is undefined. Skipping update.`);
          return;
        }

        console.info(
          `Transformed company data for ${companyWebsiteUrl}: heres the data: ${JSON.stringify(transformedCompany)}`,
        );

        const updatePayload = {
          query: {
            $or: [
              { companyWebsiteUrl: companyWebsiteUrl }, // Match by normalized companyWebsiteUrl
              {
                companyName: companyName,
                headquarters: headquarters, // Match by both companyName and headquarters
              },
            ],
          }, // Match by sourceWebsiteUrl
          updateData: transformedCompany, // Update the reviews field
          options: { upsert: true },
        };

        // Step 4: Update company data in MongoDB

        const updateResponse = await CompaniesService.updateCompany(updatePayload);

        if (updateResponse.success && updateResponse.result) {
          console.info(`Successfully updated Glassdoor data for company: ${companyWebsiteUrl}`);
        } else {
          console.info(
            `No matching company found in DB for URL: ${companyWebsiteUrl} and headquarters: ${headquarters}`,
          );
          return;
        }

        const daysBackToGetReviews = (transformedCompany?.reviewsCount ?? 0) > 1000 ? 180 : 1827; // 6 months or 5 years

        const reviewsSnapshotPayload = [
          {
            url: transformGlassdoorUrlToReviews(transformedCompany.glassdoorUrl as string),
            days: daysBackToGetReviews,
          },
        ];

        // Step 5: Request Glassdoor Reviews snapshot

        console.info(`Requesting Glassdoor Reviews snapshot for company: ${transformedCompany.glassdoorUrl}`);

        const glassdoorReviewsSnapshotId = await requestSnapshotByUrlAndFilters(
          glassdoorReviewsSnapshotUrl,
          reviewsSnapshotPayload,
        );

        console.info(
          `Glassdoor Reviews snapshotId: ${glassdoorReviewsSnapshotId}, for reviewsUrl: ${transformGlassdoorUrlToReviews(
            transformedCompany.glassdoorUrl as string,
          )}`,
        );

        if (!glassdoorReviewsSnapshotId) {
          console.error(`Failed to get Glassdoor Reviews snapshot for company: ${transformedCompany.sourceWebsiteUrl}`);
          return;
        }

        const messageToReviewsQueue = {
          snapshotId: glassdoorReviewsSnapshotId, // Get this after requesting the snapshot
          glassdoorUrl: transformedCompany.glassdoorUrl,
        };

        console.info(
          `Enqueued Glassdoor Reviews snapshot ${glassdoorReviewsSnapshotId} for company: ${companyWebsiteUrl}`,
        );

        await sendMessageToQueue(glassdoorReviewsQueueUrl, messageToReviewsQueue);
      } catch (error) {
        console.error(`Error processing Glassdoor snapshotId ${snapshotId} for company ${companyWebsiteUrl}:`, error);
        throw error; // Let SQS handle retries and DLQ
      }
    });

    await Promise.all(promises);
    console.info('Batch processing for Glassdoor snapshots completed successfully.');
  } catch (error) {
    console.error('Critical error in Glassdoor queue handler:', error);
    throw new Error('Failed to process Glassdoor queue');
  }
};

// {
//   "snapshotId": "s_m44x0z039uuxdlfad",
//   "headquarters": "Purchase, NY",
//   "companyWebsiteUrl": "https://www.mstr.cd/407uWQT",
//   "companyName": "Mastercard",
// }
