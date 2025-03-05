import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { HydratedDocument } from 'mongoose';
import axios from 'axios';
import { AccountTypeEnum, TEmployee } from 'keeperTypes';

import { headers } from '../../constants';
import connectToDatabase from '../../db';
import ValidateBody from '../validateBody';
import Employee from '../../models/Employee';
import { AccountTypeSchema } from '../../schemas/globalSchemas';
import { extractErrorMessage, getGeoLocationFromAddress } from '../../keeperApiUtils';

const googleMapsApiKey = process.env.VITE_GOOGLE_MAPS_API_KEY;

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const updateUserSettingsSchema = Joi.object({
      userId: Joi.string(),
      accountType: AccountTypeSchema,
      lastUpdatedOnWeb: Joi.boolean(),
      isIncomplete: Joi.boolean(),
      newSettings: Joi.any().required(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, updateUserSettingsSchema, callback);
    if (isError) return;

    const { userId, accountType, newSettings, lastUpdatedOnWeb, isIncomplete, isPing } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    // Extract and remove `searchRadius` from settings
    const searchRadius = newSettings.searchRadius;
    delete newSettings.searchRadius;

    const isEmployee = accountType === AccountTypeEnum.employee;

    await connectToDatabase();

    // // Fetch the user object based on `accountType`
    // const userObject = isEmployee
    //   ? await Employee.findById<TEmployee>(userId).exec()
    //   : await Job.findById<TJob>(userId).exec();
    const userObject = (await Employee.findById<TEmployee>(userId).exec()) as HydratedDocument<TEmployee>;

    if (!userObject) {
      throw new Error('User not found.');
    }

    let geoLocation = userObject.geoLocation;

    // Update geoLocation if address has changed
    if (newSettings.address && newSettings.address !== userObject.settings.address) {
      geoLocation = newSettings.address
        ? (await getGeoLocationFromAddress(newSettings.address, googleMapsApiKey)) || null
        : userObject.geoLocation;

      if (geoLocation) {
        userObject.geoLocation = geoLocation;
        userObject.markModified('geoLocation');
      }
    }

    // Merge new settings
    userObject.settings = { ...userObject.settings, ...newSettings };
    userObject.markModified('settings');

    // Prepare preferences
    const preferencesObject = isEmployee
      ? {
          searchRadius: searchRadius || 50,
          requiredYearsOfExperience: newSettings.yearsOfExperience || 0,
          relevantSkills: userObject.settings.relevantSkills || [],
          isRemote: !newSettings.onSiteOptionsOpenTo || newSettings.onSiteOptionsOpenTo.includes('Remote'),
        }
      : {
          searchRadius: searchRadius || 50,
          yearsOfExperience: newSettings.requiredYearsOfExperience || 0,
          relevantSkills: newSettings.relevantSkills || [],
          isRemote: newSettings.onSiteSchedule === 'Remote',
        };

    (userObject as any).preferences = preferencesObject;
    userObject.markModified('preferences');

    // Fetch items for swiping if the user is an employee and the profile is complete
    let itemsForSwiping = [];
    if (isEmployee && !isIncomplete) {
      try {
        const response = await axios.post(`${process.env.VITE_API_URL}/getJobsForSwiping`, {
          userId,
          preferences: preferencesObject,
        });
        itemsForSwiping = response.data || [];
      } catch (error) {
        console.error('Error fetching jobs for swiping:', error);
      }
    }

    // Update lastUpdatedOnWeb and save user
    userObject.lastUpdatedOnWeb = lastUpdatedOnWeb;
    userObject.markModified('lastUpdatedOnWeb');
    const savedUser = await userObject.save();

    // Return success response
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        itemsForSwiping,
        userData: savedUser,
      }),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in updateUserSettings:', errorMessage || error);

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
