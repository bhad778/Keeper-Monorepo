import { SQSEvent } from 'aws-lambda';
import { sendMessageToQueue } from 'keeperUtils/backendUtils';
import {
  indeedJobTransformer,
  linkedInJobTransformer,
  fetchSnapshotArrayDataById,
  checkSnapshotStatusById,
  snapshotNotReadyRequeueTimeout,
  staggerTimeout,
} from 'keeperUtils/brightDataUtils';
import { JobSourceWebsiteEnum } from 'keeperTypes';

const jobsQueueUrl = process.env.VITE_JOBS_QUEUE_URL as string;
const staggerQueueUrl = process.env.VITE_STAGGER_QUEUE_URL as string;

// this snapshot will yield an array of many jobs
// example message-
// {
//     "snapshotId": "s_m6ei1sqa28zkdqf3fe",
//     "sourceWebsite": "LinkedIn"
// }

export const handler = async (event: SQSEvent) => {
  const BATCH_SIZE = 50; // Number of jobs to process in each batch

  const promises = event.Records.map(async record => {
    const messageBody = JSON.parse(record.body);
    const { snapshotId, sourceWebsite } = messageBody;

    if (!snapshotId || !sourceWebsite) {
      console.error(`Missing snapshotId or sourceWebsite in message: ${JSON.stringify(messageBody)}`);
      return;
    }

    try {
      console.info(`Processing snapshotId: ${snapshotId}`);

      const status = await checkSnapshotStatusById(snapshotId);
      if (status !== 'ready') {
        console.info(`Snapshot ${snapshotId} is not ready. Requeuing.`);
        await sendMessageToQueue(staggerQueueUrl, messageBody, snapshotNotReadyRequeueTimeout);
        return;
      }

      // Fetch job data from the snapshot
      const jobsArray = await fetchSnapshotArrayDataById(snapshotId);
      if (!Array.isArray(jobsArray) || jobsArray.length === 0) {
        console.error(`No jobs found for snapshotId: ${snapshotId}`);
        return;
      }

      console.info(`Fetched ${jobsArray.length} jobs for snapshotId: ${snapshotId}`);

      // Function to transform a job based on the source website
      const transformJob = job => {
        if (sourceWebsite === JobSourceWebsiteEnum.Indeed) {
          return indeedJobTransformer(job);
        } else if (sourceWebsite === JobSourceWebsiteEnum.LinkedIn) {
          return linkedInJobTransformer(job);
        }
        return undefined;
      };

      // Break jobs into batches
      for (let batchIndex = 0; batchIndex * BATCH_SIZE < jobsArray.length; batchIndex++) {
        const batch = jobsArray.slice(batchIndex * BATCH_SIZE, (batchIndex + 1) * BATCH_SIZE);

        // Calculate delay for the current batch
        let delaySeconds = staggerTimeout * batchIndex;

        if (delaySeconds > 900) {
          delaySeconds = Math.floor(Math.random() * 901);
        }

        // Enqueue each transformed job in the batch to the Jobs Queue
        const batchPromises = batch.map(async job => {
          const transformedJob = transformJob(job);

          if (!transformedJob) {
            console.info(`Skipping job. Transformation returned undefined.`);
            return;
          }

          if (!transformedJob.applyLink) {
            console.info(`Skipping job. Missing applyLink. Job data: ${JSON.stringify(transformedJob)}.`);
            return;
          }

          const processJobsQueueMessage = {
            job: transformedJob,
            sourceWebsite,
          };

          // Send the transformed job to the jobs queue
          await sendMessageToQueue(jobsQueueUrl, processJobsQueueMessage, delaySeconds);
        });

        // Wait for the batch to be enqueued
        await Promise.all(batchPromises);

        console.info(
          `Enqueued batch ${batchIndex + 1} of ${
            batch.length
          } transformed jobs to the Jobs Queue with a delay of ${delaySeconds} seconds.`,
        );
      }
    } catch (error) {
      console.error(`Error processing snapshotId: ${snapshotId}`, error);
      throw error; // Let AWS handle retries
    }
  });

  await Promise.all(promises);
};
