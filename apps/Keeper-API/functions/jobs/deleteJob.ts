import { APIGatewayEvent, Context } from 'aws-lambda';
import { OperationEnum } from 'keeperTypes';

import Job from '../../models/Job';
import { headers } from '../../constants';
import connectToDatabase from '../../db';
import { extractErrorMessage } from '../../keeperApiUtils';

// ex payload-
// {
//     "query": { "url": "https://example.com/job-posting" },
//     "operation": "deleteOne"
// }

export const handler = async (event: APIGatewayEvent, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, operation = OperationEnum.One } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    await connectToDatabase();

    let deleteResult;

    if (operation === OperationEnum.One) {
      // Delete a single job
      deleteResult = await Job.deleteOne(query);
      if (deleteResult.deletedCount === 0) {
        console.info(`No job found matching query: ${JSON.stringify(query)}`);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Job not found to delete.',
          }),
        };
      }
      console.info(`Deleted one job matching query: ${JSON.stringify(query)}`);
    } else if (operation === OperationEnum.Many) {
      // Delete multiple jobs
      deleteResult = await Job.deleteMany(query);
      if (deleteResult.deletedCount === 0) {
        console.info(`No jobs found matching query: ${JSON.stringify(query)}`);

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No jobs found to delete.',
          }),
        };
      }
      console.info(`Deleted ${deleteResult.deletedCount} job(s) matching query: ${JSON.stringify(query)}`);
    } else {
      throw new Error('Invalid operation. Supported operations are "deleteOne" and "deleteMany".');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: deleteResult.deletedCount,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error deleting job(s): ${errorMessage}`);
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
