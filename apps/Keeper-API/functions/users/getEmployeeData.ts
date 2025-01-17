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
  console.log('Handler started');
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    console.log('Event body:', event.body);
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getEmployeeDataSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      isPing: Joi.boolean(),
    });

    console.log('Validating request body against schema');
    const isError = ValidateBody(event, getEmployeeDataSchema, callback);
    if (isError) {
      console.log('Validation failed');
      return;
    }

    const { phoneNumber, isPing } = JSON.parse(event.body);
    console.log('Parsed request body:', { phoneNumber, isPing });

    // Handle ping request
    if (isPing) {
      console.log('Ping request received');
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    console.log('Connecting to the database');
    await connectToDatabase();
    console.log('Database connection successful');

    // Fetch employee data
    console.log(`Fetching employee data for phone number: ${phoneNumber}`);
    const employee = await Employee.findOne({ phoneNumber }).exec();
    console.log('Employee data:', employee);

    if (!employee) {
      throw new Error(`Employee with phone number ${phoneNumber} not found.`);
    }

    // Update preferences with required education enum
    const user = employee.toObject();
    console.log('Employee object:', user);

    // Fetch jobs for swiping
    console.log('Fetching jobs for swiping');
    const jobsForSwipingResponse = await axios.post(`${process.env.ROOT_URL}/getJobsForSwiping`, {
      userId: user._id.toString(),
      preferences: user.preferences,
    });
    console.log('Jobs for swiping response:', jobsForSwipingResponse.data);

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
      jobsForSwiping: jobsForSwipingResponse.data,
    };

    console.log('Return data prepared:', returnData);

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
