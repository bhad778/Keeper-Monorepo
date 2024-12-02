import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import Job from '../../models/Job';
import { AccountTypeSchema, TUpdateMatchSchema } from '../../schemas/globalSchemas';
import { AccountTypeEnum } from '../../types/globalTypes';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
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

    // Extract other user IDs (if needed in the future)
    const idsArray = matchToUpdate.id.split('-').filter((id) => !id.includes(userId));

    await connectToDatabase();

    // Fetch the logged-in user object
    const loggedInUserObject =
      accountType === AccountTypeEnum.employee
        ? await Employee.findById(userId).exec()
        : await Job.findById(userId).exec();

    if (!loggedInUserObject) {
      throw new Error('User not found.');
    }

    // Update the match
    if (!loggedInUserObject.matches) {
      throw new Error('Matches not found.');
    }
    const matchIndex = loggedInUserObject.matches.findIndex((match) => match.id === matchToUpdate.id);
    if (matchIndex === -1) {
      throw new Error('Match not found.');
    }

    const updatedMatch = {
      ...loggedInUserObject.matches[matchIndex],
      ...matchToUpdate,
      custom: {
        ...loggedInUserObject.matches[matchIndex].custom,
        ...matchToUpdate.custom,
      },
    };

    loggedInUserObject.matches[matchIndex] = updatedMatch;
    loggedInUserObject.markModified('matches');

    // Save the updated object
    await loggedInUserObject.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Match successfully updated' }),
    });
  } catch (error) {
    console.error('Error in updateOwnMatch:', error.message || error);

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
