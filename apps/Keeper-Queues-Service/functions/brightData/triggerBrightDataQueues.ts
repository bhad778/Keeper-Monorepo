import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { JobSourceWebsiteEnum, TJobsQueueMessage } from 'keeperTypes';
import { requestSnapshotByUrlAndFilters, sendMessageToQueue } from 'keeperUtils';
import { jobsQueueUrl } from 'keeperEnvironment';

import { headers } from '../../../Keeper-API/constants';

const getLinkedInJobSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&type=discover_new&discover_by=url&limit_per_input=30';
const getIndeedJobSnapshotUrl =
  'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l4dx9j9sscpvs7no2&type=discover_new&discover_by=keyword&limit_per_input=30';

// this url searches jobs by "react developer" OR "java developer" OR "python developer" OR ".net developer" OR "typescript developer"
// OR "angular developer", past week, all experience levels, remote and hybrid and onsite, only united states
const linkedInFiltersUrl =
  'https://www.linkedin.com/jobs/search/?currentJobId=3993683401&f_E=1%2C2%2C3%2C4&f_PP=102571732%2C102277331%2C106224388%2C103112676%2C104116203%2C100420597%2C102264677%2C104472865%2C102380872%2C104383890%2C106504367%2C104194190&f_TPR=r604800&f_WT=1%2C2%2C3&keywords=react%20jobs&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R';

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
        `This resposne for LinkedIn ${linkedInSnapshotId?.data} does not have a snapshot id- ${linkedInSnapshotId}.`,
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
      await Promise.all(jobsQueueMessages.map(message => sendMessageToQueue(jobsQueueUrl as string, message)));
      console.info('Successfully sent messages to the Jobs Queue.');
    } catch (error) {
      console.error('Error sending messages to the Jobs Queue:', error);
      throw new Error('Failed to send messages to the Jobs Queue.');
    }

    // Respond with success
    console.info('Successfully added snapshots to the Jobs Queue. Sending response.');
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Successfully added LinkedIn and Indeed snapshots to the Jobs Queue',
        snapshots: jobsQueueMessages,
      }),
    });
  } catch (error) {
    console.error('Error in addJobSnapshotsToQueue:', error);

    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to add job snapshots to the Jobs Queue', error }),
    });
  }
};
