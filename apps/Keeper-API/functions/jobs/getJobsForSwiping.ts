import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
import * as Joi from 'joi';
import { SeniorityLevelToExperienceEnum, TSwipe } from 'keeperTypes';

import connectToDatabase from '../../db';
import { EmployeePreferencesSchema } from '../../schemas/globalSchemas';
import ValidateBody from '../validateBody';
import Job from '../../models/Job';
import { getItemsForSwipingLimit, headers } from '../../constants';
import Swipe from '../../models/Swipe';
import { escapeRegex, extractErrorMessage } from '../../keeperApiUtils';
import { PipelineStage } from 'mongoose';

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
    });

    const isError = ValidateBody(event, getJobsForSwipingSchema, callback);
    if (isError) return;

    const { preferences, userId, isCount, isPing } = JSON.parse(event.body);

    // Handle ping request
    if (isPing) {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify('Ping Successful'),
      });
    }

    await connectToDatabase();

    if (preferences) {
      const {
        textSearch,
        seniorityLevel,
        locationFlexibility,
        minimumSalary,
        mustIncludeSalary,
        city,
        relevantSkills,
      } = preferences;

      // Fetch swipes to exclude already swiped jobs
      // TODO: make sure this is scalable
      const swipes = await Swipe.find({ ownerId: userId });
      const alreadySwipedOnIds = swipes?.map(swipe => (swipe as TSwipe).receiverId || '');

      // Create case-insensitive regex for relevant skills
      const caseInsensitiveSkillsRegExArray = relevantSkills?.map((text: string) => new RegExp(escapeRegex(text), 'i'));

      const requiredYearsOfExperience = SeniorityLevelToExperienceEnum[seniorityLevel];
      const searchFilters: any = [];

      // filter out any jobs that the user has already swiped on
      if (alreadySwipedOnIds?.length > 0) {
        searchFilters.push({ _id: { $nin: alreadySwipedOnIds } });
      }

      // filter by requiredYearsOfExperience
      if (requiredYearsOfExperience && typeof requiredYearsOfExperience === 'number') {
        searchFilters.push(
          {
            requiredYearsOfExperience: {
              $lte: requiredYearsOfExperience + 3,
            },
          },
          {
            requiredYearsOfExperience: {
              $gte: requiredYearsOfExperience - 3,
            },
          },
        );
      }

      // filter by relevantSkills**
      if (relevantSkills && relevantSkills?.length > 0 && caseInsensitiveSkillsRegExArray?.length > 0) {
        searchFilters.push({ relevantSkills: { $in: caseInsensitiveSkillsRegExArray } });
      }

      // filter by locationFlexibility (case-insensitive, removing dashes)
      if (locationFlexibility?.length > 0) {
        const normalizedLocationFlexibility = locationFlexibility.map(text => text.replace(/-/g, '')); // Remove dashes
        const caseInsensitiveLocationFlexibility = normalizedLocationFlexibility.map(
          text => new RegExp(`^${escapeRegex(text)}$`, 'i'),
        );
        searchFilters.push({ locationFlexibility: { $in: caseInsensitiveLocationFlexibility } });
      }

      if (mustIncludeSalary) {
        searchFilters.push({
          $or: [
            // Find jobs where the max salary is greater than or equal to our minimum
            { 'formattedCompensation.payRange.max': { $gte: minimumSalary } },

            // Also include jobs where the min salary is greater than or equal to our minimum
            // This helps when jobs only specify a minimum salary without a maximum
            { 'formattedCompensation.payRange.min': { $gte: minimumSalary } },
          ],
        });
      }

      // filter by city (case-insensitive)
      if (city) {
        const caseInsensitiveCity = new RegExp(`^${escapeRegex(city)}$`, 'i');
        searchFilters.push({ jobLocation: caseInsensitiveCity });
      }

      // filter by seniorityLevel (case-insensitive)
      if (seniorityLevel?.length > 0) {
        const caseInsensitiveSeniorityLevel = seniorityLevel.map(text => new RegExp(`^${escapeRegex(text)}$`, 'i'));
        searchFilters.push({ seniorityLevel: { $in: caseInsensitiveSeniorityLevel } });
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

      // After all filters are processed, use aggregation regardless of whether minimumSalary exists
      const aggregationPipeline: PipelineStage[] = [];

      // Start with the base filters that apply to all scenarios
      if (searchFilters.length > 0) {
        aggregationPipeline.push({ $match: { $and: searchFilters } });
      }

      // If using text search, add that to the pipeline
      if (textSearch) {
        const formattedSearchTerm = buildTextSearchQuery(textSearch);
        aggregationPipeline.push({
          $match: { $text: { $search: formattedSearchTerm } },
        });

        // Add the text score as a field
        aggregationPipeline.push({
          $addFields: { score: { $meta: 'textScore' } },
        });
      }

      // Now add salary prioritization if minimumSalary exists
      if (minimumSalary) {
        aggregationPipeline.push({
          $addFields: {
            salaryPriority: {
              $cond: {
                if: {
                  $and: [
                    // Check if formattedCompensation is not null
                    { $ne: ['$formattedCompensation', null] },

                    // Check if payRange is not null
                    { $ne: ['$formattedCompensation.payRange', null] },

                    // Check if either min or max meets the minimum salary
                    {
                      $or: [
                        { $gte: ['$formattedCompensation.payRange.max', minimumSalary] },
                        { $gte: ['$formattedCompensation.payRange.min', minimumSalary] },
                      ],
                    },
                  ],
                },
                then: 1, // High priority for jobs meeting salary criteria
                else: 2, // Lower priority for all other jobs
              },
            },
          },
        });

        // Sort by salary priority first, then any other sort criteria
        if (textSearch) {
          aggregationPipeline.push({ $sort: { salaryPriority: 1, score: { $meta: 'textScore' } } });
        } else {
          aggregationPipeline.push({ $sort: { salaryPriority: 1 } });
        }
      } else {
        // If no minimum salary filter, just sort by text score if applicable
        if (textSearch) {
          aggregationPipeline.push({ $sort: { score: { $meta: 'textScore' } } });
        }
      }

      aggregationPipeline.push({
        $project: {
          _id: 1,
          relevantSkills: 1,
          jobTitle: 1,
          seniorityLevel: 1,
          locationFlexibility: 1,
          formattedCompensation: 1,
          applyLink: 1,
          companyId: 1,
        },
      });

      aggregationPipeline.push({ $limit: getItemsForSwipingLimit });

      const jobs = await Job.aggregate(aggregationPipeline).exec();

      // Populate companyId using mongoose's populate after aggregation
      if (jobs.length > 0) {
        await Job.populate(jobs, { path: 'companyId' });
      }

      console.log('jobs.length', jobs.length);

      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: jobs,
        }),
      });
    } else {
      return callback(null, {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Missing preferences in the request body.' }),
      });
    }
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
