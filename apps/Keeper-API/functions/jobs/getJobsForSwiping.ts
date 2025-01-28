import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { TSwipe } from 'keeperTypes';

import connectToDatabase from '../../db';
import { EmployeePreferencesSchema } from '../../schemas/globalSchemas';
import ValidateBody from '../validateBody';
import Job from '../../models/Job';
import { getItemsForSwipingLimit, headers, seniorDevYearsOfEpxerience } from '../../constants';
import Swipe from '../../models/Swipe';
import { escapeRegex, extractErrorMessage } from '../../keeperApiUtils';

// {
//   "userId": "6789b086457faa1335ce57d8",
//    "preferences": {
//      "searchRadius": 50,
//      "requiredYearsOfExperience": 8,
//      "geoLocation": {
//        "type": "Point",
//        "coordinates": [
//          -84.3615555,
//          34.0232431
//        ]
//      },
//      // "relevantSkills": [ 'Firebase', 'Express', 'Node', 'React', 'Redux', 'Adobe' ],
//      "relevantSkills": [ "Firebase", "Express", "Node", "React", "Redux", "Adobe" ],
//      "isRemote": true
//    }
//  }
module.exports.handler = async (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Validate request body
    if (!event.body) {
      throw new Error('Missing request body.');
    }

    const getJobsForSwipingSchema = Joi.object({
      preferences: EmployeePreferencesSchema,
      userId: Joi.string(),
      isCount: Joi.boolean(),
      isPing: Joi.boolean(),
      textSearch: Joi.string().allow(''),
    });

    const isError = ValidateBody(event, getJobsForSwipingSchema, callback);
    if (isError) return;

    const { preferences, userId, isCount, isPing, textSearch } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    let findObject: any = {};

    if (preferences) {
      const { requiredYearsOfExperience, relevantSkills } = preferences;

      // Fetch swipes to exclude already swiped jobs
      // TODO: make sure this is scalable
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

    // by default mongo text search splits the words then searches them individually and if any of them match
    // then it returns the document. This switches it to be like an and operator where all of them have to match.
    // because otherwise remote react developer would return all remote jobs
    const buildTextSearchQuery = (searchTerm: string) => {
      // Split the search term into individual words and wrap each in quotes
      const terms = searchTerm.split(/\s+/).map(term => `"${term}"`);

      // Join the terms back into a single string for the $text query
      return terms.join(' ');
    };

    if (textSearch) {
      const formattedSearchTerm = buildTextSearchQuery(textSearch);

      const textSearchFilter = { $text: { $search: formattedSearchTerm } };

      if (!findObject.$and) {
        findObject.$and = [];
      }
      findObject.$and.push(textSearchFilter);
    }

    console.info('findObject:', JSON.stringify(findObject));

    // Fetch jobs for swiping
    const jobs = await Job.find(findObject, {
      _id: 1,
      relevantSkills: 1,
      jobTitle: 1,
      jobLevel: 1,
      locationFlexibility: 1,
      formattedCompensation: 1,
      applyLink: 1,
    })
      .sort(textSearch ? { score: { $meta: 'textScore' } } : {})
      .limit(getItemsForSwipingLimit)
      .exec();

    console.log('jobs:', jobs);

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
