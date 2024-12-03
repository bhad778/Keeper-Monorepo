import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    const getEmployeeSchema = Joi.object({
      fieldName: Joi.string().required(),
      fieldValue: Joi.any().required(),
    });

    const isError = ValidateBody(event, getEmployeeSchema, callback);
    if (isError) return;

    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { fieldName, fieldValue } = JSON.parse(event.body);

    await connectToDatabase();

    // Update all employee documents
    const result = await Employee.updateMany({}, { $set: { [fieldName]: fieldValue } }).exec();

    if (!result) {
      throw new Error('Failed to update employee documents.');
    }

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    });
  } catch (error) {
    console.error('Error in setEmployeeFieldOnAllDocuments:', error.message || error);

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
