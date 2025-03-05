import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import axios from 'axios';
import { TLoggedInEmployee, TEmployeePreferences, TEmployeeSettings, TJob } from 'keeperTypes';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  console.info('Handler started');
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    console.info('Event body:', event.body);
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getEmployeeDataSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      isPing: Joi.boolean(),
    });

    console.info('Validating request body against schema');
    const isError = ValidateBody(event, getEmployeeDataSchema, callback);
    if (isError) {
      console.info('Validation failed');
      return;
    }

    const { phoneNumber, isPing } = JSON.parse(event.body);
    console.info('Parsed request body:', { phoneNumber, isPing });

    // Handle ping request
    if (isPing) {
      console.info('Ping request received');
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    console.info('Connecting to the database');
    await connectToDatabase();
    console.info('Database connection successful');

    // Fetch employee data
    console.info(`Fetching employee data for phone number: ${phoneNumber}`);
    const employee = await Employee.findOne({ phoneNumber }).exec();
    console.info('Employee data:', employee);

    if (!employee) {
      throw new Error(`Employee with phone number ${phoneNumber} not found.`);
    }

    // Update preferences with required education enum
    const user = employee.toObject();
    console.info('Employee object:', user);

    // Prepare the response data
    const loggedInEmployeeData: TLoggedInEmployee = {
      _id: user._id.toString(),
      phoneNumber: user.phoneNumber,
      accountType: user.accountType,
      receivedLikes: user.receivedLikes || [],
      expoPushToken: user.expoPushToken || '',
      hasSeenFirstLikeAlert: !!user.hasSeenFirstLikeAlert,
      hasGottenToEditProfileScreen: !!user.hasGottenToEditProfileScreen,
      hasReceivedLikeNotification: !!user.hasReceivedLikeNotification,
      settings: user.settings as TEmployeeSettings,
      preferences: user.preferences as TEmployeePreferences,
      matches: user.matches as Partial<TJob>[],
    };

    const returnData = {
      loggedInUserData: loggedInEmployeeData,
    };

    console.info('Return data prepared:', returnData);

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(returnData),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getEmployeeData:', errorMessage || error);

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
