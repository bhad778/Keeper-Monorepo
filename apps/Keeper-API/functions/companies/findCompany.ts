import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { OperationEnum } from 'keeperTypes';
import { extractErrorMessage } from 'keeperUtils';

import Company from '../../models/Company';
import { headers } from '../../constants';
import connectToDatabase from '../../db';

// ex params-
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

    await connectToDatabase();

    let result;

    if (operation === OperationEnum.One) {
      // Perform a findOne query
      result = await Company.findOne(query);
    } else if (operation === OperationEnum.Many) {
      // Perform a find query
      result = await Company.find(query, null, options);
    } else {
      throw new Error('Invalid operation. Supported operations are "One" and "Many".');
    }

    if (!result || (Array.isArray(result) && result.length === 0)) {
      console.info(`No company found matching query: ${JSON.stringify(query)}`);
      return callback(null, {
        statusCode: 404,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'No company found.',
        }),
      });
    }

    console.info(`Company/Companies found: ${Array.isArray(result) ? result.length : 1}`);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error finding company: ${errorMessage}`);

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
