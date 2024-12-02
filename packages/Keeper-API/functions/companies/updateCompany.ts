import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import Company from '../../models/Company'; // Adjust the path based on your project structure
import { headers } from '../../constants'; // Reusable headers for responses

export const handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { query, updateData, operation = 'updateOne' } = JSON.parse(event.body);

    if (!query || typeof query !== 'object') {
      throw new Error('Invalid or missing query object.');
    }

    if (!updateData || typeof updateData !== 'object') {
      throw new Error('Invalid or missing updateData object.');
    }

    let updateResult;

    if (operation === 'updateOne') {
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
    } else if (operation === 'updateMany') {
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

    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        updatedCount: operation === 'updateMany' ? updateResult.matchedCount : 1,
        updatedCompany: operation === 'updateOne' ? updateResult : null,
      }),
    });
  } catch (error) {
    console.error(`Error updating company/companies: ${error.message}`);
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
