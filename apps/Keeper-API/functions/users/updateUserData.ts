import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { AccountTypeEnum } from 'keeperTypes';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { AccountTypeSchema } from '../../schemas/globalSchemas';
import Employer from '../../models/Employer';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getUserDataSchema = Joi.object({
      userId: Joi.string().required(),
      accountType: AccountTypeSchema.required(),
      updateObject: Joi.object().required(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, getUserDataSchema, callback);
    if (isError) return;

    const { userId, accountType, updateObject, isPing } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    // Update user data
    const updatedUser =
      accountType === AccountTypeEnum.employee
        ? await Employee.findByIdAndUpdate(userId, updateObject, { new: true }).exec()
        : await Employer.findByIdAndUpdate(userId, updateObject, { new: true }).exec();

    if (!updatedUser) {
      throw new Error('User not found.');
    }

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedUser),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in updateUserData:', errorMessage || error);

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
