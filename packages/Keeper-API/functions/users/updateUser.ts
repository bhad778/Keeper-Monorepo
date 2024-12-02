import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Employer from '../../models/Employer';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { userId, updateData } = JSON.parse(event.body);

    if (!userId || !updateData) {
      throw new Error('Missing required fields: userId or updateData.');
    }

    await connectToDatabase();

    // Fetch user by ID
    const userObject = await Employer.findById(userId).exec();
    if (!userObject) {
      throw new Error(`User with ID ${userId} not found.`);
    }

    // Update user data
    Object.assign(userObject, updateData);

    // Save updated user
    const savedUser = await userObject.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedUser),
    });
  } catch (error) {
    console.error('Error in updateUser:', error.message || error);

    // Return error response
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: error.message || 'An unexpected error occurred.',
      }),
    });
  }
};
