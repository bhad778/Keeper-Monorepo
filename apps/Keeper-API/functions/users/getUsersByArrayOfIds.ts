import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import Job from '../../models/Job';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getUsersByArrayOfIdsSchema = Joi.object({
      userIdsArray: Joi.array().items(Joi.string()).required(),
      isEmployee: Joi.boolean().required(),
    });

    const isError = ValidateBody(event, getUsersByArrayOfIdsSchema, callback);
    if (isError) return;

    const { userIdsArray, isEmployee } = JSON.parse(event.body);

    await connectToDatabase();

    // Query based on the `isEmployee` flag
    const query = isEmployee
      ? Job.find().where('_id').in(userIdsArray).select('_id ownerEmail settings expoPushToken ownerId')
      : Employee.find().where('_id').in(userIdsArray).select('_id email settings expoPushToken');

    const users = await query.exec();

    if (!users || users.length === 0) {
      throw new Error('No users found for the provided IDs.');
    }

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(users),
    });
  } catch (error) {
    console.error('Error in getUsersByArrayOfIds:', error.message || error);

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
