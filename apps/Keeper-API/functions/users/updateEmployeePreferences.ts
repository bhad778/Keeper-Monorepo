import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { extractErrorMessage } from 'keeperUtils';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { EmployeePreferencesSchema } from '../../schemas/globalSchemas';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getEmployeeDataSchema = Joi.object({
      userId: Joi.string().required(),
      preferencesObject: EmployeePreferencesSchema.required(),
    });

    const isError = ValidateBody(event, getEmployeeDataSchema, callback);
    if (isError) return;

    const { userId, preferencesObject } = JSON.parse(event.body);

    await connectToDatabase();

    // Fetch employee data
    const employee = await Employee.findById(userId).exec();
    if (!employee) {
      throw new Error(`Employee with ID ${userId} not found.`);
    }

    // Update preferences
    employee.preferences = preferencesObject;
    employee.markModified('preferences');

    // Save the updated employee
    const savedEmployee = await employee.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(savedEmployee),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in updateEmployeePreferences:', errorMessage || error);

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
