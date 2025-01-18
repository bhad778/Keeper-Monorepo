import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Employer from '../../models/Employer';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const employerData = JSON.parse(event.body);

    // Connect to the database
    await connectToDatabase();

    // Create new employer
    const newEmployer = await Employer.create(employerData);

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(newEmployer),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in addEmployer:', errorMessage || error);

    // Return error response
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
