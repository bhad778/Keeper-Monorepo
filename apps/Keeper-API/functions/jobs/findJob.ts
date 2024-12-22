import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { OperationEnum } from 'keeperTypes';
import { extractErrorMessage } from 'keeperUtils';

import Job from '../../models/Job';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

// ex payload-
// {
//     "query": { "headquarters": "San Francisco, CA" },
//     "operation": "find",
//     "options": { "limit": 5, "sort": { "companyName": 1 } }
//   }

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, operation = OperationEnum.One, options = {} } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    console.info(`Finding job(s) with query: ${JSON.stringify(query)}`);
    await connectToDatabase();
    console.info(`Connected to database.`);

    let result;

    // Determine operation type
    if (operation === OperationEnum.One) {
      // Perform a findOne query

      console.info(`Finding one job.`);
      result = await Job.findOne(query);
      console.info(`Result: ${JSON.stringify(result)}`);
    } else if (operation === OperationEnum.Many) {
      // Perform a find query
      result = await Job.find(query, null, options);
    } else {
      throw new Error('Invalid operation. Supported operations are "findOne" and "find".');
    }

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
      }),
    });
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result: !result ? [] : result,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error finding job(s): ${errorMessage}`);
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
