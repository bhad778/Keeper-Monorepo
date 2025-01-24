import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { JobSourceWebsiteEnum, TJobsQueueMessage } from 'keeperTypes';
import { sendMessageToQueue } from 'keeperUtils/backendUtils';
import { requestSnapshotByUrlAndFilters, staggerTimeout } from 'keeperUtils/brightDataUtils';
import { staggerQueueUrl } from 'keeperEnvironment';
import { getIndeedJobSnapshotUrl, getLinkedInJobSnapshotUrl, linkedInFiltersUrl } from 'keeperConstants';

import { headers } from '../../../Keeper-API/constants';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.info('Starting addJobSnapshotsToQueue function.');

  try {
    // Define filters for LinkedIn and Indeed
    console.info('Defining filters for LinkedIn and Indeed.');
    const linkedInFilters = [
      {
        url: linkedInFiltersUrl,
      },
    ];

    const indeedFilters = [
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Atlanta, GA' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Los Angeles, CA' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'New York, NY' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Chicago, IL' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Austin, TX' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Boston, MA' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Seattle, WA' },
      {
        country: 'US',
        domain: 'indeed.com',
        keyword_search: 'software engineer',
        location: 'San Francisco, CA',
      },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Washington, DC' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Denver, CO' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Miami, FL' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'San Jose, CA' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Boulder, CO' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Durham, NC' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Bloomington, IL' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Huntsville, AL' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Charlotte, NC' },
      { country: 'US', domain: 'indeed.com', keyword_search: 'software engineer', location: 'Baltimore, MD' },
    ];

    // Fetch snapshots for LinkedIn and Indeed concurrently
    let linkedInSnapshotId, indeedSnapshotId;
    try {
      console.info('Fetching snapshots for LinkedIn and Indeed.');
      [linkedInSnapshotId, indeedSnapshotId] = await Promise.all([
        requestSnapshotByUrlAndFilters(getLinkedInJobSnapshotUrl, linkedInFilters),
        requestSnapshotByUrlAndFilters(getIndeedJobSnapshotUrl, indeedFilters),
      ]);
      console.info('Successfully fetched snapshots for LinkedIn and Indeed.');
    } catch (error) {
      console.error('Error fetching snapshots from BrightData:', error);
      throw new Error(
        `Error with Promise.all getting snapshots from BrightData for LinkedIn and Indeed jobs data: ${error}`,
      );
    }

    if (!linkedInSnapshotId) {
      console.error(
        `This response for LinkedIn ${linkedInSnapshotId?.data} does not have a snapshot id- ${linkedInSnapshotId}.`,
      );
      throw new Error('LinkedIn snapshot ID is missing or invalid.');
    }

    if (!indeedSnapshotId) {
      console.error(
        `This resposne for Indeed ${indeedSnapshotId?.data} does not have a snapshot id- ${indeedSnapshotId}.`,
      );
      throw new Error('Indeed snapshot ID is missing or invalid.');
    }

    console.info('Successfully validated snapshot IDs.');

    const jobsQueueMessages: TJobsQueueMessage[] = [
      {
        snapshotId: linkedInSnapshotId,
        sourceWebsite: JobSourceWebsiteEnum.LinkedIn,
      },
      {
        snapshotId: indeedSnapshotId,
        sourceWebsite: JobSourceWebsiteEnum.Indeed,
      },
    ];

    // Send messages to Jobs Queue
    try {
      console.info('Sending messages to the Jobs Queue.');
      // We currently have 2 different source websites and we will potentially have more. Each message in the jobsQueueMessages sends
      // 100s of data items down the queue pipeline. I want all those messages to be staggered. Currently we stagger things by 5 minutes
      // through the queue processes. So if I staggered these message by 5 minutes, they would each start their different queue pipelines
      // 5 minutes apart and both processes would later keep staggering and reqeueing in 5 minute intervales which means there would be a
      // lot of overlap. thats why im staggering this initial one by (staggerTimeout / 2) * 3). I did staggerTimeout / 2 because 5 / 2 is 2.5, and
      // starting the first pipeline on the 2.5 mark then the next one on the 5 mark means both of those entire processes from here on out
      // are staggered. I did * 3 at the end just to be safe, for example 2.5 * 3 is 7.5 and I just wanted to spread them out a little more to start
      await Promise.all(
        jobsQueueMessages.map(
          (message, index) =>
            sendMessageToQueue(staggerQueueUrl as string, message, index * ((staggerTimeout / 2) * 3)), // 7.5 minutes
        ),
      );
      console.info('Successfully sent messages to the Jobs Queue.');
    } catch (error) {
      console.error('Error sending messages to the Jobs Queue:', error);
      throw new Error('Failed to send messages to the Jobs Queue.');
    }

    // Respond with success
    console.info('Successfully added snapshots to the Jobs Queue. Sending response.');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Successfully added LinkedIn and Indeed snapshots to the Jobs Queue',
        snapshots: jobsQueueMessages,
      }),
    };
  } catch (error) {
    console.error('Error in addJobSnapshotsToQueue:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to add job snapshots to the Jobs Queue', error }),
    };
  }
};
