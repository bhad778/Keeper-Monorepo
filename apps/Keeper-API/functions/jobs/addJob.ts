import { APIGatewayEvent, Context } from 'aws-lambda';
import { TJob } from 'keeperTypes';
import { extractErrorMessage } from 'keeperUtils';

import Job from '../../models/Job';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { jobs }: { jobs: TJob[] } = JSON.parse(event.body);

    if (!Array.isArray(jobs) || jobs.length === 0) {
      throw new Error('Invalid or missing jobs data. "jobs" must be a non-empty array.');
    }

    await connectToDatabase();

    // Add jobs using insertMany
    const addResult = await Job.insertMany(jobs, { ordered: false });

    console.info(`Added ${addResult.length} job(s).`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result: addResult,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error adding job(s): ${errorMessage}`);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
      }),
    };
  }
};
