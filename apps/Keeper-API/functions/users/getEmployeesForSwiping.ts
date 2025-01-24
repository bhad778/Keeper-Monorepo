import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { TSwipe } from 'keeperTypes';
import { convertMilesToMeters, escapeRegex, shuffleArray } from 'keeperUtils/backendUtils';

import { getItemsForSwipingLimit, headers, seniorDevYearsOfEpxerience } from '../../constants';
import connectToDatabase from '../../db';
import * as Joi from 'joi';
import { JobPreferencesSchema } from '../../schemas/globalSchemas';
import ValidateBody from '../validateBody';
import Swipe from '../../models/Swipe';
import Employee from '../../models/Employee';
import { extractErrorMessage } from '../../keeperApiUtils';

export const handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate the event body against the schema
    const getEmployeesForSwipingSchema = Joi.object({
      preferences: JobPreferencesSchema,
      jobId: Joi.string(),
      isNew: Joi.boolean(),
      isCount: Joi.boolean(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, getEmployeesForSwipingSchema, callback);
    if (isError) return;

    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const body = JSON.parse(event.body);
    const { preferences, jobId, isNew, isCount, isPing } = body;

    // Return success for ping
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    let findObject: any = { 'preferences.isNew': false };

    if (preferences) {
      const {
        searchRadius,
        yearsOfExperience,
        relevantSkills,
        geoLocation,
        isRemote,
        frontendBackendOptionsOpenTo,
        companySizeOptionsOpenTo,
        employmentTypeOptionsOpenTo,
        workAuthOptionsOpenTo,
      } = preferences;

      // Retrieve already swiped-on IDs
      const swipes = await Swipe.find({ ownerId: jobId });
      const alreadySwipedOnIds = swipes.map(swipe => (swipe as TSwipe).receiverId);

      // Build skill regex filters
      const caseInsensitiveSkillsRegExArray = relevantSkills.map((text: string) => new RegExp(escapeRegex(text), 'i'));

      const isSeniorDev = yearsOfExperience >= seniorDevYearsOfEpxerience;

      // Build search filters
      const searchFilters: any[] = [
        { _id: { $nin: alreadySwipedOnIds } },
        { 'settings.yearsOfExperience': { $lte: isSeniorDev ? 40 : yearsOfExperience + 3 } },
        { 'settings.yearsOfExperience': { $gte: yearsOfExperience - 3 } },
        { 'settings.relevantSkills': { $in: caseInsensitiveSkillsRegExArray } },
        { 'settings.companySizeOptionsOpenTo': { $in: companySizeOptionsOpenTo } },
        { 'settings.frontendBackendOptionsOpenTo': { $in: frontendBackendOptionsOpenTo } },
        { 'settings.employmentTypeOptionsOpenTo': { $in: employmentTypeOptionsOpenTo } },
        { 'preferences.isNew': false },
      ];

      // Apply work authorization filters
      if (workAuthOptionsOpenTo.includes('Authorized') && !workAuthOptionsOpenTo.includes('Not Authorized')) {
        searchFilters.push({ 'settings.isUsCitizen': true });
      } else if (!workAuthOptionsOpenTo.includes('Authorized') && workAuthOptionsOpenTo.includes('Not Authorized')) {
        searchFilters.push({ 'settings.isUsCitizen': false });
      }

      // Apply location filter
      if (!isRemote && geoLocation) {
        searchFilters.push({
          geoLocation: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: geoLocation.coordinates,
              },
              $maxDistance: convertMilesToMeters(searchRadius),
            },
          },
        });
      }

      // Update findObject based on filters if user is not new
      if (!isNew) {
        findObject = { $and: searchFilters };
      }

      // Return count if `isCount` is true
      if (isCount) {
        const count = await Employee.find(findObject).countDocuments();
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify(count),
        });
      }
    }

    // Fetch employees for swiping
    const employees = await Employee.find(findObject, {
      _id: 1,
      receivedLikes: 1,
      email: 1,
      settings: 1,
      expoPushToken: 1,
    })
      .sort({ 'settings.yearsOfExperience': -1 })
      .limit(getItemsForSwipingLimit);

    // Shuffle the results and return
    callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(shuffleArray(employees)),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getEmployeesForSwiping:', errorMessage || error);
    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: errorMessage || 'An unexpected error occurred.',
      }),
    });
  }
};
