import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import Job from '../../models/Job';
import { headers } from '../../constants';

// ex payload-
// {
//     "query": { "url": "https://example.com/job-posting" },
//     "operation": "deleteOne"
// }

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, operation = 'deleteOne' } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    let deleteResult;

    if (operation === 'deleteOne') {
      // Delete a single job
      deleteResult = await Job.deleteOne(query);
      if (deleteResult.deletedCount === 0) {
        console.info(`No job found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Job not found to delete.',
          }),
        });
      }
      console.info(`Deleted one job matching query: ${JSON.stringify(query)}`);
    } else if (operation === 'deleteMany') {
      // Delete multiple jobs
      deleteResult = await Job.deleteMany(query);
      if (deleteResult.deletedCount === 0) {
        console.info(`No jobs found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No jobs found to delete.',
          }),
        });
      }
      console.info(`Deleted ${deleteResult.deletedCount} job(s) matching query: ${JSON.stringify(query)}`);
    } else {
      throw new Error('Invalid operation. Supported operations are "deleteOne" and "deleteMany".');
    }

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        deletedCount: deleteResult.deletedCount,
      }),
    });
  } catch (error) {
    console.error(`Error deleting job(s): ${error.message}`);
    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    });
  }
};
