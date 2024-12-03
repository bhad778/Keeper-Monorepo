import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import axios from 'axios';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { EducationEnum } from '../../types/globalTypes';
import { TLoggedInEmployee } from '../../types/loggedInUserTypes';
import { TEmployeePreferences, TEmployeeSettings } from '../../types/employeeTypes';
import { TJob } from '../../types/employerTypes';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getEmployeeDataSchema = Joi.object({
      phoneNumber: Joi.string().required(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, getEmployeeDataSchema, callback);
    if (isError) return;

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

    // Fetch employee data
    const employee = await Employee.findOne({ phoneNumber }).exec();
    if (!employee) {
      throw new Error(`Employee with phone number ${phoneNumber} not found.`);
    }

    // Update preferences with required education enum
    const user = employee.toObject();

    // Fetch jobs for swiping
    const jobsForSwipingResponse = await axios.post(`${process.env.ROOT_URL}/getJobsForSwiping`, {
      userId: user._id.toString(),
      preferences: user.preferences,
    });

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

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(returnData),
    });
  } catch (error) {
    console.error('Error in getEmployeeData:', error.message || error);

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
