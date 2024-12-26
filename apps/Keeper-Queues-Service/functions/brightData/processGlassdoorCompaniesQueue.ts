import { SQSEvent } from 'aws-lambda';
import { TBrightDataGlassdoorCompany } from 'keeperTypes';
import { logApiError, normalizeLocation, normalizeUrl } from 'keeperUtils';
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
import { glassdoorReviewsQueueUrl, glassdoorCompaniesQueueUrl, crunchbaseCompaniesQueueUrl } from 'keeperEnvironment';

const glassdoorReviewsSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j1po0921hbu0ri1z&include_errors=true';

const getGlassdoorCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j0bx501ockwldaqf&include_errors=true&type=discover_new&discover_by=keyword';
const getCrunchbaseCompanyInfoSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vijqt9jfj7olije&include_errors=true';

const glassdoorSearchUrl = 'https://www.glassdoor.com/Search/results.htm?keyword=';

// {
//   "snapshotId": "s_m501jgtk1otvx27w6f",
//   "companyName": "Gusto",
//   "headquarters": "San Francisco, CA",
//   "companyWebsiteUrl": "https://www.gusto.com",
//   "retries": 0
// }

export const handler = async (event: SQSEvent) => {
  try {
    console.info('Starting batch processing for Glassdoor snapshots.');

    // Ensure database connection is established
    const promises = event.Records.map(async record => {
      let snapshotId, headquarters, companyWebsiteUrl, companyName, retries;

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

        // you must have a companyWebsiteUrl or both headquarters and companyName to continue which is companyWebsiteUrl || (headquarters && companyName)
        // so to catch when you shouldnt continue we just reversed that by putting ! in front of everything
        if (!(companyWebsiteUrl || (headquarters && companyName))) {
          console.error(
            `This message is missing a required field. You must have a companyWebsiteUrl or both headquarters and companyName. Skipping, but here is the message: ${JSON.stringify(
              messageBody,
            )} and here they are after normalization: companyWebsiteUrl: ${companyWebsiteUrl}, headquarters: ${headquarters}, companyName: ${companyName}`,
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

        console.info(`Snapshot ${snapshotId} for ${companyName} is ready.`);

        // Step 2: Fetch Glassdoor data
        const glassdoorResults: TBrightDataGlassdoorCompany[] = await fetchSnapshotArrayDataById(snapshotId);
        console.info(`Fetched ${glassdoorResults.length} Glassdoor results for ${companyName}`);

        // Step 3: Match Glassdoor data with the current company
        const matchedCompany = glassdoorResults.find(result => {
          if (result.error || result.error_code) {
            console.info(`Error in Glassdoor result: ${JSON.stringify(result)}. Skipping this result.`);
            return false; // Skip this result
          }

          const normalizedGlassdoorHeadquarters = normalizeLocation(result.details_headquarters || '');
          const normalizedGlassdoorWebsite = normalizeUrl(result.details_website || '', true);

          return (
            (headquarters != null && normalizedGlassdoorHeadquarters === headquarters) ||
            (companyWebsiteUrl != null && normalizedGlassdoorWebsite === companyWebsiteUrl)
          );
        });

        if (!matchedCompany) {
          console.info(`No matching Glassdoor company found for ${companyWebsiteUrl}. Skipping. But here
            is the Glassdoor data fetched: ${JSON.stringify(
              glassdoorResults,
            )}. And heres what we tried to match any of the results on, headquarters: ${headquarters} and companyWebsiteUrl: ${companyWebsiteUrl}.`);
          throw new Error('No matching Glassdoor company found');
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

        // Step 4: Update company data in MongoDB
        const updateResponse = await CompaniesService.updateCompany({
          query: {
            $or: [
              { companyWebsiteUrl: companyWebsiteUrl }, // Match by normalized companyWebsiteUrl
              { companyName: companyName, headquarters: headquarters }, // Match by both companyName and headquarters
            ],
          },
          updateData: { ...transformedCompany, lastGlassdoorCompanyUpdate: new Date() },
        });

        if (updateResponse.success) {
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

        await sendMessageToQueue(glassdoorReviewsQueueUrl, messageToReviewsQueue);

        console.info(
          `Enqueued Glassdoor Reviews snapshot with this data to the glassdoor reviews queue- ${messageToReviewsQueue}`,
        );
      } catch (error) {
        logApiError('sendMessageToQueue', { snapshotId, companyWebsiteUrl }, error);

        // Requeue in Glassdoor queue for retry, and then fallback to Crunchbase

        if (retries >= 1) {
          const crunchbaseFilters = [{ url: `https://www.crunchbase.com/organization/${companyName.toLowerCase()}` }];

          const crunchbaseSnapshotId = await requestSnapshotByUrlAndFilters(
            getCrunchbaseCompanyInfoSnapshotUrl,
            crunchbaseFilters,
          );

          console.info(
            `Successfully got crunchbase company snapshot ID ${crunchbaseSnapshotId} for
             company ${companyName}.`,
          );

          const newMessageBody = { ...messageBody, snapshotId: crunchbaseSnapshotId };

          console.info(`Max retries reached. Sending ${companyName} to Crunchbase queue.`);

          await sendMessageToQueue(crunchbaseCompaniesQueueUrl, newMessageBody);
        } else {
          console.info(`Retrying Glassdoor snapshot for ${companyName}. Retry count: ${retries + 1}`);

          const glassdoorFilters = [
            {
              search_url: `${glassdoorSearchUrl}${encodeURIComponent(companyName as string)}`,
              max_search_results: 5,
            },
          ];

          // Step 4: Request a glassdoor snapshot for the company and send it back into this function with retries + 1
          const glassdoorSnapshotId = await requestSnapshotByUrlAndFilters(
            getGlassdoorCompanyInfoSnapshotUrl,
            glassdoorFilters,
          );

          const newMessageBody = { ...messageBody, snapshotId: glassdoorSnapshotId, retries: retries + 1 };

          await sendMessageToQueue(glassdoorCompaniesQueueUrl, newMessageBody);
        }
      }
    });

    await Promise.all(promises);
    console.info('Batch processing for Glassdoor snapshots completed successfully.');
  } catch (error) {
    console.error('Critical error in Glassdoor queue handler:', error);

    throw new Error('Failed to process Glassdoor queue');
  }
};
