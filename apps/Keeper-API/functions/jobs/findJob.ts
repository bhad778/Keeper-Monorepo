import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import Job from '../../models/Job';
import { headers } from '../../constants';
import { OperationEnum } from 'keeperTypes';

// ex payload-
// {
//     "query": { "headquarters": "San Francisco, CA" },
//     "operation": "find",
//     "options": { "limit": 5, "sort": { "companyName": 1 } }
//   }

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, operation = OperationEnum.One, options = {} } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    let result;

    // Determine operation type
    if (operation === OperationEnum.One) {
      // Perform a findOne query
      result = await Job.findOne(query);
    } else if (operation === OperationEnum.Many) {
      // Perform a find query
      result = await Job.find(query, null, options);
    } else {
      throw new Error('Invalid operation. Supported operations are "findOne" and "find".');
    }

    // Check result
    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.info(`No job(s) found matching query: ${JSON.stringify(query)}`);
      return callback(null, {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No job(s) found.',
        }),
      });
    }

    console.info(`Job(s) found: ${Array.isArray(result) ? result.length : 1}`);
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
      }),
    });
  } catch (error) {
    console.error(`Error finding job(s): ${error.message}`);
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
