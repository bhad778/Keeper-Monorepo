import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { OperationEnum } from 'keeperTypes';
import { extractErrorMessage } from 'keeperUtils';

import Job from '../../models/Job';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

// ex payload-
// {
//     "query": { "url": "https://example.com/job-posting" },
//     "updateData": {
//       "receivedLikes": 15,
//       "jobSummary": "Updated job summary for a single job."
//     },
//     "operation": "updateOne"
//   }

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, updateData, operation = OperationEnum.One, options = {} } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid or missing updateData object.');
    }

    await connectToDatabase();

    let updateResult;

    if (operation === OperationEnum.One) {
      // Update a single job
      updateResult = await Job.findOneAndUpdate(query, updateData, { new: true, ...options });
      if (!updateResult) {
        console.info(`No job found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Job not found to update.',
          }),
        });
      }
      console.info(`Updated one job matching query: ${JSON.stringify(query)}`);
    } else if (operation === OperationEnum.Many) {
      // Update multiple jobs
      updateResult = await Job.updateMany(query, updateData, options);
      if (updateResult.matchedCount === 0) {
        console.info(`No jobs found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No jobs found to update.',
          }),
        });
      }
      console.info(`Updated ${updateResult.matchedCount} job(s) matching query: ${JSON.stringify(query)}`);
    } else {
      throw new Error('Invalid operation. Supported operations are "updateOne" and "updateMany".');
    }

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        updatedCount: operation === 'updateMany' ? updateResult.matchedCount : 1,
        updatedJob: operation === 'updateOne' ? updateResult : null,
      }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error updating job(s): ${errorMessage}`);
    callback(null, {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: errorMessage,
      }),
    });
  }
};
