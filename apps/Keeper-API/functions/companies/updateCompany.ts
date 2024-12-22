import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { OperationEnum } from 'keeperTypes';
import { extractErrorMessage } from 'keeperUtils';

import Company from '../../models/Company'; // Adjust the path based on your project structure
import { headers } from '../../constants'; // Reusable headers for responses
import connectToDatabase from '../../db';

// ex payload-
// {
//     "query": { "jobsUrl": "https://example.com/job-posting" },
//     "updateData": {
//       "companyType": "Private",
//       "reviewsCount": 1
//     },
//     "operation": "updateMany"
//   }

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, updateData, operation = OperationEnum.One } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid or missing updateData object.');
    }

    await connectToDatabase();

    let updateResult;

    if (operation === OperationEnum.One) {
      // Update a single company
      updateResult = await Company.findOneAndUpdate(query, updateData, { new: true });
      if (!updateResult) {
        console.info(`No company found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Company not found to update.',
          }),
        });
      }
      console.info(`Updated one company matching query: ${JSON.stringify(query)}`);
    } else if (operation === OperationEnum.Many) {
      // Update multiple companies
      updateResult = await Company.updateMany(query, updateData);
      if (updateResult.matchedCount === 0) {
        console.info(`No companies found matching query: ${JSON.stringify(query)}`);
        return callback(null, {
          statusCode: 404,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'No companies found to update.',
          }),
        });
      }
      console.info(`Updated ${updateResult.matchedCount} company/companies matching query: ${JSON.stringify(query)}`);
    } else {
      throw new Error('Invalid operation. Supported operations are "updateOne" and "updateMany".');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        updatedCount: operation === 'updateMany' ? updateResult.matchedCount : 1,
        updatedCompany: operation === 'updateOne' ? updateResult : null,
      }),
    };
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error(`Error updating company/companies: ${errorMessage}`);

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
