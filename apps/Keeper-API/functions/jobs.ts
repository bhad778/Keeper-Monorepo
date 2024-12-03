// 'use strict';
// require('dotenv').config({ path: '../variables.env' });

// import connectToDatabase from '../db';
// import Job from '../models/Job';
// import ValidateBody from './validateBody';
// import * as Joi from 'joi';
// import axios from 'axios';
// import {
//   JobPreferencesSchema,
//   JobSettingsSchema,
//   JobSchema,
//   EmployeePreferencesSchema,
// } from '../schemas/globalSchemas';
// import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
// import { EducationEnum, TSwipe } from '../types/globalTypes';
// import { TJob } from '../types/employerTypes';
// import Swipe from '../models/Swipe';
// import { getGeoLocationFromAddress } from '../utils/geoLocationUtils';
// import { getItemsForSwipingLimit, seniorDevYearsOfEpxerience } from '../constants';
// import { escapeRegex } from '../utils/globalUtils';
// import { headers } from '../constants';
// import Company from '../models/Company';

// // String.prototype.toObjectId = () => {
// //   const ObjectId = require('mongoose').Types.ObjectId;
// //   return new ObjectId(this.toString());
// // };

// module.exports.addJob = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const addJobSchema = Joi.object({
//     newJobData: JobSchema,
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, addJobSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const { newJobData } = JSON.parse(event.body);

//     newJobData.settings.education = EducationEnum[newJobData.settings.education];

//     connectToDatabase().then(async () => {
//       // check if a job with this company has ever been
//       // added before, if not add it to companies db
//       Company.find({ name: newJobData.settings.companyName })
//         .then((res) => {
//           // check if it didnt find anything, if not add it to db
//           if (res && res.length === 0) {
//             const newCompanyObject = {
//               name: newJobData.settings.companyName,
//               description: newJobData.settings.companyDescription,
//               img: newJobData.settings.img,
//             };
//             Company.create(newCompanyObject).catch((error) => {
//               console.error('There was an error creating company after adding job: ', error);
//             });
//           }
//         })
//         .catch((error) => {
//           console.error('There was an error finding company after adding job: ', error);
//         });

//       const geoLocation = await getGeoLocationFromAddress(newJobData?.settings?.address);

//       newJobData.geoLocation = geoLocation;
//       newJobData.preferences.geoLocation = geoLocation;

//       Job.create(newJobData)
//         .then((res) => {
//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(res),
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           callback(new Error(err));
//         });
//     });
//   }
// };

// module.exports.deleteJob = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const deleteJobSchema = Joi.object({
//     jobId: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, deleteJobSchema, callback);

//   if (isError) return;
//   const { jobId } = JSON.parse(event.body);

//   connectToDatabase().then(async () => {
//     Job.deleteOne({ _id: jobId })
//       .then((res) => {
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         callback(new Error(err));
//       });
//   });
// };

// module.exports.deleteOldJobs = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const twoMonthsAgo = new Date();
//   twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

//   connectToDatabase().then(async () => {
//     Job.deleteMany({ createdAt: { $lt: twoMonthsAgo } })
//       .then((res) => {
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//         callback(new Error(err));
//       });
//   });
// };

// module.exports.getJobById = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getJobByIdSchema = Joi.object({
//     jobId: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, getJobByIdSchema, callback);

//   if (isError) return;

//   const { jobId } = JSON.parse(event.body);

//   connectToDatabase().then(async () => {
//     try {
//       const job = await Job.findById(jobId).exec();
//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify(job),
//       });
//     } catch (error) {
//       console.error('There was an error getting job by id' + error);
//       callback(new Error(error));
//     }
//   });
// };

// module.exports.onSelectJob = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const onSelectJobSchema = Joi.object({
//     jobId: Joi.string(),
//     preferences: JobPreferencesSchema,
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, onSelectJobSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const { jobId, preferences } = JSON.parse(event.body);

//     connectToDatabase().then(async () => {
//       axios
//         .all([
//           axios.post(
//             process.env.ROOT_URL + '/getJobById',
//             JSON.stringify({
//               jobId,
//             })
//           ),
//           axios.post(
//             process.env.ROOT_URL + '/getEmployeesForSwiping',
//             JSON.stringify({
//               preferences,
//               jobId,
//             })
//           ),
//         ])
//         .then((res) => {
//           const jobData = res[0].data;
//           jobData.settings.education = EducationEnum[jobData.settings.education];
//           jobData.preferences.education = jobData.preferences.education;

//           const getEmployeesForSwipingResponse = res[1].data;

//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify({
//               jobData: jobData,
//               employeesForSwiping: getEmployeesForSwipingResponse,
//             }),
//           });
//         })
//         .catch((error) => {
//           console.error('There was an error getting employees for swiping: ' + error);
//           callback(new Error(error));
//         });
//     });
//   }
// };

// module.exports.setJobFieldOnAllDocuments = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeeSchema = Joi.object({
//     fieldName: Joi.string().required(),
//     fieldValue: Joi.any().required(),
//   });

//   const isError = ValidateBody(event, getEmployeeSchema, callback);

//   if (isError) return;

//   const { fieldName, fieldValue } = JSON.parse(event.body);

//   connectToDatabase().then(() => {
//     Job.updateMany({}, { $set: { [fieldName]: fieldValue } })
//       .exec()
//       .then((res) => {
//         if (res) {
//           return callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(res),
//           });
//         } else {
//           return callback(null, {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({
//               error: 'Account deleted error',
//             }),
//           });
//         }
//       })
//       .catch((err) => callback(new Error(err)));
//   });
// };

// module.exports.updateJobData = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updatejobDataSchema = Joi.object({
//     jobId: Joi.string().required(),
//     updateObject: Joi.any().required(),
//     // {'isNew': false};
//   });

//   const isError = ValidateBody(event, updatejobDataSchema, callback);

//   if (isError) return;

//   if (event.body != null) {
//     const { jobId, updateObject } = JSON.parse(event.body);

//     connectToDatabase().then(async () => {
//       try {
//         const res = await Job.findByIdAndUpdate(jobId, updateObject);
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }
//     });
//   }
// };

// module.exports.updateJobPreferences = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateJobPreferencesSchema = Joi.object({
//     jobId: Joi.string().required(),
//     preferences: JobPreferencesSchema.required(),
//   });

//   const isError = ValidateBody(event, updateJobPreferencesSchema, callback);

//   if (isError) return;

//   const { jobId, preferences } = JSON.parse(event.body);

//   var savedJob;

//   connectToDatabase().then(async () => {
//     let jobObject;
//     try {
//       jobObject = await Job.findById(jobId).exec();
//     } catch (err) {
//       console.error(err);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: err }),
//       });
//     }

//     // if (preferencesObject?.address) {
//     //   const geoLocation = await getGeoLocationFromAddress(preferencesObject?.address);
//     //   preferencesObject.geoLocation = geoLocation;
//     // }

//     // every time this function is called, the filters array property on employee object in DB
//     // is going to get completely replaced. When landing on preferences page on frontend, it will
//     // prefill the preferences based on the current filters object in DB, so the frontend version will be
//     // a copy of backend version, if something changes, it will allow the user to save, which will call this function,
//     // and will send the entire frontend copy of the filters object except with the new changes
//     if (preferences.education) {
//       preferences.education = EducationEnum[preferences.education];
//     }

//     jobObject._doc.preferences = preferences;

//     jobObject.markModified('preferences');

//     try {
//       savedJob = await jobObject.save();
//     } catch (err) {
//       console.error(err);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: err }),
//       });
//     }

//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify(savedJob._doc),
//     });
//   });
// };

// module.exports.getJobsForSwiping = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getJobsForSwipingSchema = Joi.object({
//     preferences: EmployeePreferencesSchema,
//     userId: Joi.string(),
//     isPublic: Joi.boolean(),
//     isCount: Joi.boolean(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, getJobsForSwipingSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     connectToDatabase().then(async () => {
//       const { preferences, userId, isPublic, isCount } = JSON.parse(event.body);

//       let findObject: any = {
//         'settings.title': { $ne: null },
//       };

//       if (isPublic) {
//         findObject = {
//           $and: [{ 'settings.title': { $ne: null } }, { 'settings.isPublic': { $eq: true } }],
//         };
//       }

//       // if no userId is passed in that means user is not logged in, and we want findObject to be settings.title": { $ne: null }, so it gets everything
//       // it should be if(preferences)- so public job board page can pass preferences
//       if (preferences) {
//         const { searchRadius, requiredYearsOfExperience, geoLocation, relevantSkills, isRemote, isNew } = preferences;

//         const swipes = await Swipe.find({ ownerId: userId });

//         var alreadySwipedOnIds: string[] = [];

//         if (swipes) {
//           swipes.map((swipe: TSwipe) => {
//             alreadySwipedOnIds.push(swipe.receiverId || '');
//           });
//         }

//         const caseInsensitiveSkillsRegExArray: any = [];
//         relevantSkills.forEach((text: string) => {
//           caseInsensitiveSkillsRegExArray.push(new RegExp(escapeRegex(text), 'i'));
//         });

//         const isSeniorDev = requiredYearsOfExperience >= seniorDevYearsOfEpxerience;

//         const searchFilters: any = [
//           { _id: { $nin: alreadySwipedOnIds } },
//           // if they are a senior dev, dont have an upper filter on years of experience. 40 is an arbitrary number
//           {
//             'settings.requiredYearsOfExperience': {
//               $lte: isSeniorDev ? 40 : requiredYearsOfExperience + 3,
//             },
//           },
//           {
//             'settings.requiredYearsOfExperience': {
//               $gte: requiredYearsOfExperience - 3,
//             },
//           },
//           { 'settings.relevantSkills': { $in: caseInsensitiveSkillsRegExArray } },
//           // { "settings.compensation.type": { $in: compensation.typesOpenTo } },
//           // {
//           //   $or: [
//           //     {
//           //       $and: [
//           //         {
//           //           "settings.compensation.payRange.min": {
//           //             $lte: compensation.targetSalary,
//           //           },
//           //         },
//           //         {
//           //           "settings.compensation.payRange.max": {
//           //             $gte: compensation.targetSalary,
//           //           },
//           //         },
//           //       ],
//           //     },
//           //     {
//           //       $and: [
//           //         {
//           //           "settings.compensation.payRange.min": {
//           //             $lte: compensation.targetHourly,
//           //           },
//           //         },
//           //         {
//           //           "settings.compensation.payRange.max": {
//           //             $gte: compensation.targetHourly,
//           //           },
//           //         },
//           //       ],
//           //     },
//           //   ],
//           // },
//         ];

//         // this is the location filter
//         // if (!isRemote && geoLocation) {
//         //   searchFilters.push({
//         //     geoLocation: {
//         //       $near: {
//         //         $geometry: {
//         //           type: 'Point',
//         //           coordinates: [geoLocation.coordinates[0], geoLocation.coordinates[1]],
//         //         },
//         //         $maxDistance: convertMilesToMeters(searchRadius),
//         //       },
//         //     },
//         //   });
//         // }
//         // if (requiredEducation !== 0) {
//         //   searchFilters.push({ "settings.requiredEducation": { $lte: requiredEducation } });
//         // }

//         // only if user is logged in and has created a profile, then use real filters
//         if (!isNew) {
//           findObject = {
//             $and: searchFilters,
//           };
//         }

//         if (isCount) {
//           try {
//             const count = await Job.find(findObject).count();
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify(count),
//             });
//           } catch (error) {
//             (err) => callback(new Error(err));
//           }
//           return;
//         }
//       }

//       Job.find(findObject, {
//         _id: 1,
//         receivedLikes: 1,
//         ownerEmail: 1,
//         settings: 1,
//         expoPushToken: 1,
//         ownerId: 1,
//       })
//         .limit(getItemsForSwipingLimit)
//         .then((res) => {
//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(res),
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           callback(new Error(err));
//         });
//     });
//   }
// };

// module.exports.updateJobSettings = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateJobSettingsSchema = Joi.object({
//     jobId: Joi.string().required(),
//     updateJobSettingsObject: JobSettingsSchema.required(),
//   });

//   const isError = ValidateBody(event, updateJobSettingsSchema, callback);

//   if (isError) return;

//   const { jobId, updateJobSettingsObject } = JSON.parse(event.body);

//   var savedJob;

//   connectToDatabase().then(async () => {
//     try {
//       const jobObject = await Job.findById(jobId).exec();

//       if (jobObject) {
//         const currentJobSettings = { ...jobObject?._doc?.settings };

//         if (updateJobSettingsObject.education) {
//           updateJobSettingsObject.education = EducationEnum[updateJobSettingsObject.education];
//         }

//         jobObject._doc.settings = {
//           ...currentJobSettings,
//           ...updateJobSettingsObject,
//         };
//         jobObject?.markModified('settings');

//         // if the address has changed, update geoLocation
//         if (updateJobSettingsObject?.address && updateJobSettingsObject?.address != jobObject._doc.settings.address) {
//           const geoLocation = await getGeoLocationFromAddress(updateJobSettingsObject?.address);

//           jobObject._doc.geoLocation = geoLocation;
//           jobObject?.markModified('geoLocation');
//         }
//       }

//       // if (newGeoLocation) {
//       //   jobObject._doc.geoLocation = newGeoLocation;
//       //   jobObject.markModified("geoLocation");
//       // }

//       try {
//         savedJob = await jobObject?.save();
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }

//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify(savedJob._doc),
//       });
//     } catch (err) {
//       console.error(err);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: err }),
//       });
//     }
//   });
// };

// module.exports.searchCompanyName = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const searchCompanyNameSchema = Joi.object({
//     companyName: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, searchCompanyNameSchema, callback);

//   if (isError) return;

//   const { companyName } = JSON.parse(event.body);

//   connectToDatabase().then(() => {
//     const agg = [
//       { $search: { index: 'companiesNameSearch', text: { query: companyName, path: 'name' } } },
//       { $limit: 20 },
//       { $project: { _id: 0, name: 1, description: 1, img: 1 } },
//     ];

//     Company.aggregate(agg)
//       .then((res) => {
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       })
//       .catch((err) => {
//         console.error('searchCompanyName error: ', err);
//         callback(new Error(err));
//       });
//   });
// };

// module.exports.getEmployersJobs = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeeSchema = Joi.object({
//     userId: Joi.string(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, getEmployeeSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const { userId } = JSON.parse(event.body);

//     connectToDatabase().then(() => {
//       Job.find({
//         $or: [
//           { ownerId: userId },
//           {
//             $and: [{ publicTakers: { $in: [userId] } }, { 'settings.isPublic': true }],
//           },
//         ],
//       })
//         // Job.find({ phoneNumber: body.phoneNumber })
//         .then((res: TJob[]) => {
//           const oldestToNewestJobs = res.sort((a, b) => {
//             return a.createdAt.getTime() - b.createdAt.getTime();
//           });

//           const employersJobs: TJob[] = [];

//           oldestToNewestJobs.map((job) => {
//             job._doc.settings.education = EducationEnum[job.settings.education];
//             job._doc.preferences.education = job.preferences.education;
//             employersJobs.push(job);
//           });

//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(employersJobs),
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           callback(new Error(err));
//         });
//     });
//   }
// };
