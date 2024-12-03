import { APIGatewayEvent, Context, Callback } from 'aws-lambda';

import Company from '../../models/Company';
import { headers } from '../../constants';

// ex params-
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

    const { query, operation = 'findOne', options = {} } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    let result;

    if (operation === 'findOne') {
      // Perform a findOne query
      result = await Company.findOne(query);
    } else if (operation === 'find') {
      // Perform a find query
      result = await Company.find(query, null, options);
    } else {
      throw new Error('Invalid operation. Supported operations are "findOne" and "find".');
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
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        result,
      }),
    });
  } catch (error) {
    console.error(`Error finding company: ${error.message}`);
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
