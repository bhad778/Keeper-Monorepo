import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { AccountTypeEnum } from 'keeperTypes';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import Job from '../../models/Job';
import { AccountTypeSchema } from '../../schemas/globalSchemas';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const deleteMatchSchema = Joi.object({
      userId: Joi.string().required(),
      accountType: AccountTypeSchema,
      matchToDeleteId: Joi.string().required(),
    });

    const isError = ValidateBody(event, deleteMatchSchema, callback);
    if (isError) return;

    const { userId, accountType, matchToDeleteId } = JSON.parse(event.body);

    await connectToDatabase();

    // Fetch the logged-in user's document
    const loggedInUserObject =
      accountType === AccountTypeEnum.employee
        ? await Employee.findById(userId).exec()
        : await Job.findById(userId).exec();

    if (!loggedInUserObject) {
      throw new Error('User not found.');
    }

    // Filter out the match to delete
    const updatedMatches = (loggedInUserObject.matches || []).filter(match => match.id !== matchToDeleteId);

    loggedInUserObject.matches = updatedMatches;
    loggedInUserObject.markModified('matches');

    // Save the updated document
    await loggedInUserObject.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Match successfully deleted',
        matches: updatedMatches,
      }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in deleteMatch:', errorMessage || error);

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
