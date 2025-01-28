import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { AccountTypeEnum } from 'keeperTypes';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { AccountTypeSchema, TUpdateMatchSchema } from '../../schemas/globalSchemas';
import Job from '../../models/Job';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const updateMatchSchema = Joi.object({
      userId: Joi.string().required(),
      accountType: AccountTypeSchema,
      matchToUpdate: TUpdateMatchSchema.required(),
    });

    const isError = ValidateBody(event, updateMatchSchema, callback);
    if (isError) return;

    const { userId, accountType, matchToUpdate } = JSON.parse(event.body);

    // Extract the other user ID from the match ID
    const idsArray = matchToUpdate.id.split('-').filter(id => !id.includes(userId));
    const otherUserId = idsArray[0];

    await connectToDatabase();

    // Fetch both users based on account type
    const [loggedInUser, otherUser] =
      accountType === AccountTypeEnum.employee
        ? await Promise.all([Employee.findById(userId).exec(), Job.findById(otherUserId).exec()])
        : await Promise.all([Job.findById(userId).exec(), Employee.findById(otherUserId).exec()]);

    if (!loggedInUser || !otherUser) {
      throw new Error('Account deleted error');
    }

    // Update the logged-in user's match
    if (loggedInUser.matches) {
      const loggedInUserIndex = loggedInUser.matches.findIndex(x => x.id === matchToUpdate.id);
      if (loggedInUserIndex !== -1) {
        loggedInUser.matches[loggedInUserIndex] = {
          ...loggedInUser.matches[loggedInUserIndex],
          ...matchToUpdate,
        };
        loggedInUser.markModified('matches');
      }
    }

    // Update the other user's match with hasNotification set to true
    const otherUserIndex = otherUser.matches ? otherUser.matches.findIndex(x => x.id === matchToUpdate.id) : -1;
    if (otherUser.matches && otherUserIndex !== -1) {
      otherUser.matches[otherUserIndex] = {
        ...otherUser.matches[otherUserIndex],
        ...matchToUpdate,
        custom: {
          ...otherUser.matches[otherUserIndex].custom,
          hasNotification: true,
        },
      };
      otherUser.markModified('matches');
    }

    // Save both users
    await Promise.all([loggedInUser.save(), otherUser.save()]);

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Match successfully updated' }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in updateMatchForBothOwners:', errorMessage || error);

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
