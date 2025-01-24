import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { extractErrorMessage } from 'keeperUtils/backendUtils';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Employer from '../../models/Employer';

// the employee/employer object is going to have most data needed
// for the whole app, so this is used on app load for matches, settings, etc.
export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { phoneNumber } = JSON.parse(event.body);

    if (!phoneNumber) {
      throw new Error('Missing required field: phoneNumber.');
    }

    // Connect to the database
    await connectToDatabase();

    // Find employer by phone number
    const employers = await Employer.find({ phoneNumber });

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(employers),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getEmployer:', errorMessage || error);

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
