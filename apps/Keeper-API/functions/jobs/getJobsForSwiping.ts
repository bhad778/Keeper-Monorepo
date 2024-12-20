import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import { extractErrorMessage, escapeRegex } from 'keeperUtils';
import * as Joi from 'joi';
import { TSwipe } from 'keeperTypes';

import connectToDatabase from '../../db';
import { EmployeePreferencesSchema } from '../../schemas/globalSchemas';
import ValidateBody from '../validateBody';
import Job from '../../models/Job';
import { getItemsForSwipingLimit, headers, seniorDevYearsOfEpxerience } from '../../constants';
import Swipe from '../../models/Swipe';

module.exports.getJobsForSwiping = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback,
) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getJobsForSwipingSchema = Joi.object({
      preferences: EmployeePreferencesSchema,
      userId: Joi.string(),
      isPublic: Joi.boolean(),
      isCount: Joi.boolean(),
      isPing: Joi.boolean(),
    });

    const isError = ValidateBody(event, getJobsForSwipingSchema, callback);
    if (isError) return;

    const { preferences, userId, isPublic, isCount, isPing } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    let findObject: any = {
      'settings.title': { $ne: null },
    };

    if (isPublic) {
      findObject = {
        $and: [{ 'settings.title': { $ne: null } }, { 'settings.isPublic': { $eq: true } }],
      };
    }

    if (preferences) {
      const { requiredYearsOfExperience, relevantSkills, isNew } = preferences;

      // Fetch swipes to exclude already swiped jobs
      const swipes = await Swipe.find({ ownerId: userId });
      const alreadySwipedOnIds = swipes.map(swipe => (swipe as TSwipe).receiverId || '');

      // Create case-insensitive regex for relevant skills
      const caseInsensitiveSkillsRegExArray = relevantSkills.map((text: string) => new RegExp(escapeRegex(text), 'i'));

      const isSeniorDev = requiredYearsOfExperience >= seniorDevYearsOfEpxerience;

      const searchFilters: any = [
        { _id: { $nin: alreadySwipedOnIds } },
        {
          'settings.requiredYearsOfExperience': {
            $lte: isSeniorDev ? 40 : requiredYearsOfExperience + 3,
          },
        },
        {
          'settings.requiredYearsOfExperience': {
            $gte: requiredYearsOfExperience - 3,
          },
        },
        { 'settings.relevantSkills': { $in: caseInsensitiveSkillsRegExArray } },
      ];

      if (!isNew) {
        findObject = {
          $and: searchFilters,
        };
      }

      // Handle count request
      if (isCount) {
        const count = await Job.countDocuments(findObject).exec();
        return callback(null, {
          statusCode: 200,
          headers,
          body: JSON.stringify(count),
        });
      }
    }

    // Fetch jobs for swiping
    const jobs = await Job.find(findObject, {
      _id: 1,
      receivedLikes: 1,
      ownerEmail: 1,
      settings: 1,
      expoPushToken: 1,
      ownerId: 1,
    })
      .limit(getItemsForSwipingLimit)
      .exec();

    return callback(null, {
      statusCode: 200,
      headers,
      body: JSON.stringify(jobs),
    });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);

    console.error('Error in getJobsForSwiping:', errorMessage || error);

    callback(null, {
      statusCode: 400,
      headers,
      body: JSON.stringify({ message: errorMessage || 'An unexpected error occurred.' }),
    });
  }
};
