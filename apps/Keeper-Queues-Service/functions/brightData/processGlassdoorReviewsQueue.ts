import { SQSEvent } from 'aws-lambda';
import { CompaniesService } from 'keeperServices';
import { glassdoorReviewsQueueUrl } from 'keeperEnvironment';

import { requeueMessage, checkSnapshotStatusById, fetchSnapshotArrayDataById } from 'keeperUtils/brightDataUtils';

export const handler = async (event: SQSEvent) => {
  try {
    console.info('Starting batch processing for Glassdoor reviews.');

    const promises = event.Records.map(async record => {
      const messageBody = JSON.parse(record.body);
      const { snapshotId, glassdoorUrl } = messageBody;

      if (!snapshotId || !glassdoorUrl) {
        console.error(`Message missing snapshotId or sourceWebsiteUrl. Skipping: ${JSON.stringify(messageBody)}`);
        return;
      }

      // Step 1: Check snapshot status
      const status = await checkSnapshotStatusById(snapshotId);
      if (status !== 'ready') {
        console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
        await requeueMessage(glassdoorReviewsQueueUrl, messageBody, 600); // Requeue after 10 minutes
        return;
      }

      // Step 2: Fetch Glassdoor reviews data
      const reviewsResponseArray = await fetchSnapshotArrayDataById(snapshotId);
      if (!reviewsResponseArray || reviewsResponseArray.length === 0) {
        console.info(`No reviews found for snapshotId: ${snapshotId}. Skipping.`);
        return;
      }

      const reviewsArray = reviewsResponseArray.slice(0, 50);

      console.info(`Fetched ${reviewsArray.length} reviews for snapshotId: ${snapshotId}`);

      // Step 3: Update company data using the updateCompany Lambda
      const updatePayload = {
        query: { sourceWebsiteUrl: glassdoorUrl }, // Match by sourceWebsiteUrl
        updateData: { reviews: reviewsArray }, // Update the reviews field
      };

      try {
        const updateResponse = await CompaniesService.updateCompany(updatePayload);

        if (updateResponse.data.success) {
          console.info(`Successfully updated reviews for company with URL: ${glassdoorUrl}`);
        } else {
          console.error(
            `Failed to update reviews for company with URL: ${glassdoorUrl}. Response: ${JSON.stringify(
              updateResponse.data,
            )}`,
          );
        }
      } catch (updateError) {
        console.error(`Error calling updateCompany Lambda for URL: ${glassdoorUrl}. Error: ${updateError}`);
      }
    });

    await Promise.all(promises);
    console.info('Batch processing for Glassdoor reviews completed successfully.');
  } catch (error) {
    console.error('Critical error in Glassdoor reviews queue handler:', error);
    throw new Error('Failed to process Glassdoor reviews queue');
  }
};
