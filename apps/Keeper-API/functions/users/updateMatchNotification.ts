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
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const updateMatchNotificationSchema = Joi.object({
      userId: Joi.string().required(),
      accountType: Joi.string().required(),
      matchId: Joi.string().required(),
      hasNotification: Joi.boolean().required(),
    });

    const isError = ValidateBody(event, updateMatchNotificationSchema, callback);
    if (isError) return;

    const { userId, accountType, matchId, hasNotification } = JSON.parse(event.body);

    await connectToDatabase();

    // Determine whether to fetch an Employee or Job object
    const saveObject =
      accountType === 'employee' ? await Employee.findById(userId).exec() : await Job.findById(userId).exec();

    if (!saveObject) {
      throw new Error('User not found.');
    }

    // Update the match
    if (!saveObject.matches) {
      throw new Error('Matches not found.');
    }
    const matchIndex = saveObject.matches.findIndex((match) => match.id === matchId);
    if (matchIndex === -1) {
      throw new Error('Match not found.');
    }

    saveObject.matches[matchIndex].custom.hasNotification = hasNotification;
    saveObject.markModified('matches');

    // Save the updated document
    await saveObject.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Success' }),
    });
  } catch (error) {
    console.error('Error in updateMatchNotification:', error.message || error);

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
