import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import axios from 'axios';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import Employer from '../../models/Employer';
import ValidateBody from '../validateBody';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body against the schema
    const getEmployerDataSchema = Joi.object({
      phoneNumber: Joi.string(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, getEmployerDataSchema);
    if (isError) {
      throw new Error('Validation failed for request body.');
    }

    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const { phoneNumber, isPing } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    // Find the employer by phone number
    const employer = await Employer.findOne({ phoneNumber });

    if (!employer) {
      throw new Error('Employer not found.');
    }

    // Fetch employer's jobs
    const response = await axios.post(`${process.env.ROOT_URL}/getEmployersJobs`, {
      userId: employer._id,
    });

    const returnData = {
      loggedInUserData: { ...employer.toObject(), employersJobs: response.data },
    };

    // Return success response
    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(returnData),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getEmployerData:', errorMessage || error);

    // Return error response
    return callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
