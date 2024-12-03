// /* eslint-disable no-unused-vars */
// 'use strict';
// require('dotenv').config({ path: '../variables.env' });
// import axios from 'axios';

// import connectToDatabase from '../db';
// import Employer from '../models/Employer';
// import Employee from '../models/Employee';
// import Job from '../models/Job';
// import Swipe from '../models/Swipe';
// import { TLoggedInEmployee } from '../types/loggedInUserTypes';
// import { AccountTypeEnum, EducationEnum, TMatch, TSwipe } from '../types/globalTypes';
// import { TEmployee, TEmployeeEducation, TEmployeePreferences } from '../types/employeeTypes';
// import { TEmployer, TJobPreferences } from '../types/employerTypes';
// import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
// import ValidateBody from './validateBody';
// import {
//   AccountTypeSchema,
//   EmployeePreferencesSchema,
//   JobPreferencesSchema,
//   TMatchSchema,
//   TUpdateMatchSchema,
// } from '../schemas/globalSchemas';
// import * as Joi from 'joi';
// import { colors, getItemsForSwipingLimit, SENDER_EMAIL, seniorDevYearsOfEpxerience } from '../constants';
// import { getGeoLocationFromAddress } from '../utils/geoLocationUtils';
// import { escapeRegex, shuffleArray } from '../utils/globalUtils';
// import { headers } from '../constants';

// const AWS = require('aws-sdk');

// String.prototype.toObjectId = () => {
//   const ObjectId = require('mongoose').Types.ObjectId;
//   return new ObjectId(this.toString());
// };

// // start employer/employee shared functions

// module.exports.preSignUp = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   event.response.autoConfirmUser = true;
//   event.response.autoVerifyPhone = true;
//   callback(null, event);
// };

// module.exports.addCognitoUserToMongoDb = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   // TODO fix error handling
//   // TODO change trigger to post authentication
//   connectToDatabase().then(() => {
//     if (event.request.userAttributes['custom:accountType'] == 'employer') {
//       const newEmployer: TEmployer = {
//         phoneNumber: event.request.userAttributes.phone_number,
//         accountType: 'employer',
//         createdAt: new Date(),
//         isNew: true,
//         hasSeenFirstLikeAlert: false,
//         expoPushToken: null,
//         email: event.request.userAttributes['custom:email'],
//         hasReceivedLikeNotification: false,
//       };

//       Employer.create(newEmployer)
//         .then(() => {
//           callback(null, event);
//         })
//         .catch((err) => callback(new Error(err)), event);
//     } else if (event.request.userAttributes['custom:accountType'] == 'employee') {
//       const newEmployee: TEmployee = {
//         phoneNumber: event.request.userAttributes.phone_number,
//         accountType: 'employee',
//         createdAt: new Date(),
//         lastUpdatedOnWeb: null,
//         email: event.request.userAttributes['custom:email'],
//         expoPushToken: null,
//         geoLocation: null,
//         yearsOfExperience: null,
//         receivedLikes: [],
//         education: null,
//         hasSeenFirstLikeAlert: false,
//         hasGottenToEditProfileScreen: false,
//         hasReceivedLikeNotification: false,
//         matches: [],
//         settings: {
//           firstName: null,
//           lastName: null,
//           img: null,
//           address: null,
//           aboutMeText: null,
//           relevantSkills: [],
//           jobTitle: null,
//           searchRadius: null,
//           isUsCitizen: null,
//           onSiteOptionsOpenTo: null,
//           isSeekingFirstJob: null,
//           jobHistory: null,
//           educationHistory: null,
//           employmentTypesOpenTo: null,
//           companySizeOptionsOpenTo: [],
//           frontendBackendOptionsOpenTo: [],
//         },
//         // this is default set to cast the widest net possible, but as soon
//         // as user edits their profile, this will get updated accordingly
//         preferences: {
//           searchRadius: 50,
//           requiredYearsOfExperience: 0,
//           geoLocation: {
//             type: 'Point',
//             coordinates: [1, 2],
//           },
//           relevantSkills: [],
//           isRemote: true,
//           isNew: true,
//         },
//       };

//       Employee.create(newEmployee)
//         .then((res) => {
//           callback(null, event);
//         })
//         .catch((err) => callback(new Error(err)), event);
//     }
//   });
// };

// module.exports.updateExpoPushToken = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const { accountType, expoPushToken, id } = JSON.parse(event.body);

//   var savedEmployer;
//   var savedEmployee;

//   connectToDatabase().then(async () => {
//     if (accountType == 'employer') {
//       try {
//         var employerObject = await Employer.findById(id).exec();
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }
//       employerObject._doc.expoPushToken = expoPushToken;

//       employerObject.markModified('expoPushToken');

//       // also add expoPushToken to all your own jobs
//       Job.updateMany({ ownerId: id }, { '$set': { expoPushToken: expoPushToken } });

//       // get all your own jobs
//       const employersJobs = await Job.find({ ownerId: id });

//       type otherMatchIdsObject = {
//         employeeId: string;
//         matchId: string;
//       };

//       // and then loop through jobs, then loop through each jobs matches
//       // and get otherUserId out of them,
//       const otherMatchesIdsArray: otherMatchIdsObject[] = [];
//       employersJobs.forEach((doc: any) => {
//         doc.matches.forEach((match: TMatch) => {
//           otherMatchesIdsArray.push({ employeeId: match.custom.employeeId, matchId: match.id });
//         });
//       });
//       // then loop through each otherUserId
//       // getting their matches, finding that matchId in the matches, and
//       // adding your expoPushToken to each one

//       otherMatchesIdsArray.forEach(async (otherMatchIdObject: otherMatchIdsObject) => {
//         const { employeeId, matchId } = otherMatchIdObject;
//         try {
//           const employeeRes = await Employee.findById(employeeId).exec();
//           const index = employeeRes?._doc?.matches?.findIndex((match) => match.id == matchId);

//           employeeRes._doc.matches[index].custom.expoPushToken = expoPushToken;

//           employeeRes.markModified('matches');

//           employeeRes?.save();
//         } catch (error) {
//           console.error('error updating employees with expoPushToken:', error);
//         }
//       });

//       try {
//         savedEmployer = await employerObject.save();
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
//         body: JSON.stringify(savedEmployer._doc),
//       });
//     } else {
//       try {
//         var employeeObject = await Employee.findById(id).exec();
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }
//       employeeObject._doc.expoPushToken = expoPushToken;

//       employeeObject.markModified('expoPushToken');

//       type otherMatchIdsObject = {
//         jobId: string;
//         matchId: string;
//       };

//       const otherMatchesIdsArray: otherMatchIdsObject[] = [];
//       employeeObject._doc.matches.forEach((match: TMatch) => {
//         otherMatchesIdsArray.push({ jobId: match.custom.jobId, matchId: match.id });
//       });

//       otherMatchesIdsArray.forEach(async (otherMatchIdObject: otherMatchIdsObject) => {
//         const { jobId, matchId } = otherMatchIdObject;
//         try {
//           const jobRes = await Job.findById(jobId).exec();
//           const index = jobRes?._doc?.matches?.findIndex((match) => match.id == matchId);

//           jobRes._doc.matches[index].custom.expoPushToken = expoPushToken;

//           jobRes.markModified('matches');

//           jobRes?.save();
//         } catch (error) {
//           console.error('error updating jobs with expoPushToken:', error);
//         }
//       });

//       try {
//         savedEmployee = await employeeObject.save();
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
//         body: JSON.stringify(savedEmployee._doc),
//       });
//     }
//   });
// };

// module.exports.updateUser = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const { userId, updateData } = JSON.parse(event.body);
//   var savedUser;

//   connectToDatabase().then(async () => {
//     try {
//       let userObject = await Employer.findById(userId).exec();

//       userObject._doc = { ...userObject._doc, ...updateData };

//       try {
//         savedUser = await userObject.save();
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
//         body: JSON.stringify(savedUser._doc),
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
// //end shared functions

// //employer functions
// module.exports.addEmployer = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase().then(() => {
//     Employer.create(JSON.parse(event.body))
//       .then((res) => {
//         callback(null, { statusCode: 200, body: JSON.stringify(res) });
//       })
//       .catch((err) => callback(new Error(err)));
//   });
// };

// // the employee/employer object is going to have most data needed
// // for the whole app, so this is used on app load for matches, settings, etc.
// module.exports.getEmployer = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const body = JSON.parse(event.body);

//   connectToDatabase().then(() => {
//     Employer.find({ phoneNumber: body.phoneNumber })
//       .then((res) => {
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       })
//       .catch((err) => callback(new Error(err)));
//   });
// };

// // gets all data needs for employer for using app
// module.exports.getEmployerData = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployerData = Joi.object({
//     phoneNumber: Joi.string(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, getEmployerData, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const { phoneNumber } = JSON.parse(event.body);

//     connectToDatabase().then(() => {
//       var user;
//       Employer.find({ phoneNumber: phoneNumber })
//         .then((res) => {
//           user = res[0]._doc;
//           const promisesArray = [
//             axios.post(process.env.ROOT_URL + '/getEmployersJobs', {
//               'userId': user._id,
//             }),
//           ];
//           axios.all(promisesArray).then((res) => {
//             var returnArray = {
//               loggedInUserData: { ...user, employersJobs: res[0].data },
//             };
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify(returnArray),
//             });
//           });
//         })
//         .catch((err) => callback(new Error(err)));
//     });
//   }
// };

// module.exports.getEmployeesForSwiping = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeesForSwipingSchema = Joi.object({
//     preferences: JobPreferencesSchema,
//     jobId: Joi.string(),
//     isNew: Joi.boolean(),
//     isCount: Joi.boolean(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, getEmployeesForSwipingSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     connectToDatabase().then(async () => {
//       let findObject: any = {
//         'preferences.isNew': false,
//       };

//       const { preferences, jobId, isNew, isCount } = JSON.parse(event.body);

//       // if no jobId is passed in that means user is not logged in, and we want findObject to be "settings.firstName": { $ne: null },, so it gets everything
//       if (preferences) {
//         const {
//           searchRadius,
//           yearsOfExperience,
//           relevantSkills,
//           geoLocation,
//           isRemote,
//           frontendBackendOptionsOpenTo,
//           companySizeOptionsOpenTo,
//           employmentTypeOptionsOpenTo,
//           workAuthOptionsOpenTo,
//         } = preferences;

//         const swipes = await Swipe.find({ ownerId: jobId });

//         var alreadySwipedOnIds = [];

//         // we will pass employee object into this call, with that we
//         // will get geolocation, distance set in settings, and jobsAlreadySwipedOn
//         if (swipes) {
//           swipes.map((swipe: TSwipe) => {
//             alreadySwipedOnIds.push(swipe.receiverId);
//           });
//         }

//         const caseInsensitiveSkillsRegExArray: any = [];
//         relevantSkills.forEach((text: string) => {
//           caseInsensitiveSkillsRegExArray.push(new RegExp(escapeRegex(text), 'i'));
//         });

//         const isSeniorDev = yearsOfExperience >= seniorDevYearsOfEpxerience;

//         const searchFilters: any = [
//           { _id: { $nin: alreadySwipedOnIds } },
//           // if they are a senior dev, dont have an upper filter on years of experience. 40 is an arbitrary number
//           { 'settings.yearsOfExperience': { $lte: isSeniorDev ? 40 : yearsOfExperience + 3 } },
//           { 'settings.yearsOfExperience': { $gte: yearsOfExperience - 3 } },
//           { 'settings.relevantSkills': { $in: caseInsensitiveSkillsRegExArray } },
//           { 'settings.companySizeOptionsOpenTo': { $in: companySizeOptionsOpenTo } },
//           { 'settings.frontendBackendOptionsOpenTo': { $in: frontendBackendOptionsOpenTo } },
//           { 'settings.employmentTypeOptionsOpenTo': { $in: employmentTypeOptionsOpenTo } },
//           { 'preferences.isNew': false },
//           // { "settings.compensation.typesOpenTo": { $in: compensation.type } },
//           // {
//           //   "settings.compensation.targetSalary": {
//           //     $gte: compensation.payRange.min,
//           //   },
//           // },
//           // {
//           //   "settings.compensation.targetSalary": {
//           //     $lte: compensation.payRange.max,
//           //   },
//           // },
//           // { education: { $gte: EducationEnum[education] } },
//         ];

//         // if the recruiter has selected they only want to see Authorized candidates, then only get us citizens
//         // if the recruiter has selected they only want to see Not Authorized candidates, only get non us citizens
//         // if they have selected both or neither than dont do anything
//         if (workAuthOptionsOpenTo.includes('Authorized') && !workAuthOptionsOpenTo.includes('Not Authorized')) {
//           searchFilters.push({ 'settings.isUsCitizen': true });
//         } else if (!workAuthOptionsOpenTo.includes('Authorized') && workAuthOptionsOpenTo.includes('Not Authorized')) {
//           searchFilters.push({ 'settings.isUsCitizen': false });
//         }

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

//         // only if user is logged in and has created a profile, then use real filters
//         if (!isNew) {
//           findObject = {
//             $and: searchFilters,
//           };
//         }

//         if (isCount) {
//           try {
//             const count = await Employee.find(findObject).count();
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

//       // putting one there means only return those fields and nothing more
//       Employee.find(findObject, {
//         _id: 1,
//         receivedLikes: 1,
//         email: 1,
//         settings: 1,
//         expoPushToken: 1,
//       })
//         .sort({ 'settings.yearsOfExperience': -1 })
//         .limit(getItemsForSwipingLimit)
//         .then((res) => {
//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(shuffleArray(res)),
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           callback(new Error(err));
//         });
//     });
//   }
// };
// //end employer functions

// // employee functions

// module.exports.setEmployeeFieldOnAllDocuments = (
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
//     Employee.updateMany({}, { $set: { [fieldName]: fieldValue } })
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

// module.exports.recordSwipe = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const recordSwipeSchema = Joi.object({
//     ownerId: Joi.string().required(),
//     isRightSwipe: Joi.boolean().required(),
//     receiverId: Joi.string().required(),
//     timeStamp: Joi.string().required(),
//     createdOnWeb: Joi.boolean().required(),
//     isMatch: Joi.boolean().required(),
//     accountType: Joi.string().required(),
//     likeNotificationObject: Joi.any(),
//     jobOwnerId: Joi.string().allow(''),
//   });

//   const isError = ValidateBody(event, recordSwipeSchema, callback);

//   if (isError) return;

//   const newSwipe = JSON.parse(event.body);

//   connectToDatabase().then(async () => {
//     // user refers to job or employee here and throughout app
//     let receivingUser;
//     let receivingEmployer;
//     const isEmployee = newSwipe.accountType === 'employee';

//     try {
//       if (isEmployee) {
//         receivingUser = await Job.findById(newSwipe.receiverId).exec();
//         if (newSwipe.jobOwnerId) {
//           receivingEmployer = await Employer.findById(newSwipe.jobOwnerId).exec();
//         }
//       } else {
//         receivingUser = await Employee.findById(newSwipe.receiverId).exec();
//       }

//       const sendYouGotALikeEmailNotification = () => {
//         if (isEmployee) {
//           const discoverLinkStringified = JSON.stringify('https://keepertechjobs.io/employerHome/jobBoard');
//           const jobTemplateData = `{ \"discoverlink\":${discoverLinkStringified}}`;

//           if (receivingUser.ownerEmail) {
//             let params = {
//               Source: SENDER_EMAIL,
//               Template: 'YouReceivedALikeJobTemplate',
//               Destination: {
//                 ToAddresses: [receivingUser.ownerEmail],
//               },
//               TemplateData: jobTemplateData,
//             };
//             emailPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
//           }
//         } else if (!isEmployee) {
//           const discoverLinkStringified = JSON.stringify('https://keepertechjobs.io/employeeHome/discover');
//           const employeeTemplateData = `{ \"discoverlink\":${discoverLinkStringified}}`;

//           if (receivingUser.email) {
//             let params = {
//               Source: SENDER_EMAIL,
//               Template: 'YouReceivedALikeEmployeeTemplate',
//               Destination: {
//                 ToAddresses: [receivingUser.email],
//               },
//               TemplateData: employeeTemplateData,
//             };
//             emailPromise = new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
//           }
//         }
//       };

//       const sendYouGotALikePushNotification = async () => {
//         if (newSwipe.likeNotificationObject) {
//           try {
//             await axios.post(process.env.ROOT_URL + '/sendPubnubNotification', {
//               'messageObject': newSwipe.likeNotificationObject,
//             });
//           } catch (error) {
//             console.error(
//               'There was an error with sendPubnubNotification call that was made inside the recordSwipe call-',
//               error
//             );
//           }
//         }
//       };

//       let emailPromise;

//       // only if its a right swipe but not a match, send the you got a like
//       // email and push notifications and add to receivedLikes
//       if (newSwipe.isRightSwipe && !newSwipe.isMatch) {
//         sendYouGotALikePushNotification();
//         sendYouGotALikeEmailNotification();

//         if (isEmployee) {
//           // set hasReceivedLikeNotification to true for employers
//           receivingEmployer._doc.hasReceivedLikeNotification = true;
//           receivingEmployer.markModified('hasReceivedLikeNotification');
//         } else {
//           // receivingUser will be employees here
//           receivingUser._doc.hasReceivedLikeNotification = true;
//           receivingUser.markModified('hasReceivedLikeNotification');
//         }

//         receivingUser._doc.receivedLikes.push(newSwipe.ownerId);
//         receivingUser.markModified('receivedLikes');
//       }

//       let promises = [receivingUser.save(), Swipe.create(newSwipe)];

//       if (receivingEmployer) {
//         promises.push(receivingEmployer.save());
//       }

//       if (emailPromise) {
//         promises.push(emailPromise);
//       }

//       try {
//         await axios.all(promises);

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({ message: 'Successfully recorded swipe' }),
//         });
//       } catch (error) {
//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: error }),
//         });
//       }
//     } catch (error) {
//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: error }),
//       });
//     }
//   });
// };

// module.exports.getEmployee = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeeSchema = Joi.object({
//     userId: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, getEmployeeSchema, callback);

//   if (isError) return;

//   const { userId } = JSON.parse(event.body);

//   connectToDatabase().then(() => {
//     Employee.findById(userId)
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

// module.exports.getUsersByArrayOfIds = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getUsersByArrayOfIdsSchema = Joi.object({
//     userIdsArray: Joi.array().items(Joi.string()).required(),
//     isEmployee: Joi.boolean().required(),
//   });

//   const isError = ValidateBody(event, getUsersByArrayOfIdsSchema, callback);

//   if (isError) return;

//   const { userIdsArray, isEmployee } = JSON.parse(event.body);

//   connectToDatabase().then(() => {
//     if (isEmployee) {
//       Job.find()
//         .where('_id')
//         .in(userIdsArray)
//         .select('_id ownerEmail settings expoPushToken ownerId')
//         .exec()
//         .then((res) => {
//           if (res) {
//             return callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify(res),
//             });
//           } else {
//             return callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({
//                 error: 'Error getting users by ids array',
//               }),
//             });
//           }
//         })
//         .catch((err) => callback(new Error(err)));
//     } else {
//       Employee.find()
//         .where('_id')
//         .in(userIdsArray)
//         .select('_id email settings expoPushToken')
//         .exec()
//         .then((res) => {
//           if (res) {
//             return callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify(res),
//             });
//           } else {
//             return callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({
//                 error: 'Error getting users by ids array',
//               }),
//             });
//           }
//         })
//         .catch((err) => callback(new Error(err)));
//     }
//   });
// };

// // module.exports.getUserCount = (
// //   event: APIGatewayEvent,
// //   context: Context,
// //   callback: APIGatewayProxyCallback
// // ) => {
// //   context.callbackWaitsForEmptyEventLoop = false;

// //   const getUserCountSchema = Joi.object({
// //     query: Joi.any(),
// //   });

// //   const isError = ValidateBody(event, getUserCountSchema, callback);

// //   if (isError) return;

// //   if (event.body != null) {
// //     const { query } = JSON.parse(event.body);

// //     connectToDatabase().then(async () => {
// //       try {
// //         const count = await Employee.find({ query }).count();
// //         callback(null, {
// //           statusCode: 200,
// //           headers,
// //           body: JSON.stringify(count),
// //         });
// //       } catch (error) {
// //         (err) => callback(new Error(err));
// //       }

// //       // Employee.find({ query })
// //       //   .then((res) => {
// //       //     callback(null, {
// //       //       statusCode: 200,
// //       //       headers,
// //       //       body: JSON.stringify(res),
// //       //     });
// //       //   })
// //       //   .catch((err) => callback(new Error(err)));
// //     });
// //   }
// // };

// // gets all data needed for employee for using app
// module.exports.getEmployeeData = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeeDataSchema = Joi.object({
//     phoneNumber: Joi.string().required(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, getEmployeeDataSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     if (event.body != null) {
//       const { phoneNumber } = JSON.parse(event.body);

//       connectToDatabase().then(() => {
//         let user: TEmployee;
//         Employee.find({ phoneNumber: phoneNumber })
//           .then((res) => {
//             user = res[0]._doc;
//             user.preferences.requiredEducation = EducationEnum[user.preferences.requiredEducation];

//             let promises = [
//               axios.post(process.env.ROOT_URL + '/getJobsForSwiping', {
//                 'userId': user._id.toString(),
//                 'preferences': user.preferences,
//               }),
//             ];

//             axios
//               .all(promises)
//               .then((res) => {
//                 const loggedInEmployeeData: TLoggedInEmployee = {
//                   _id: user._id,
//                   phoneNumber: user.phoneNumber,
//                   accountType: user.accountType,
//                   receivedLikes: user.receivedLikes,
//                   expoPushToken: user.expoPushToken,
//                   hasSeenFirstLikeAlert: user.hasSeenFirstLikeAlert,
//                   hasGottenToEditProfileScreen: user.hasGottenToEditProfileScreen,
//                   hasReceivedLikeNotification: user.hasReceivedLikeNotification,
//                   settings: user.settings,
//                   preferences: user.preferences,
//                   matches: user.matches,
//                 };

//                 var returnArray = {
//                   loggedInUserData: loggedInEmployeeData,
//                   jobsForSwiping: res[0].data,
//                 };

//                 callback(null, {
//                   statusCode: 200,
//                   headers,
//                   body: JSON.stringify(returnArray),
//                 });
//               })
//               .catch((error) => {
//                 console.error(error);
//                 callback(null, {
//                   statusCode: 422,
//                   body: JSON.stringify({
//                     message: error,
//                     input: event,
//                   }),
//                 });
//               });
//           })
//           .catch((err) => callback(new Error(err)));
//       });
//     }
//   }
// };

// module.exports.updateEmployeePreferences = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getEmployeeDataSchema = Joi.object({
//     userId: Joi.string().required(),
//     preferencesObject: EmployeePreferencesSchema.required(),
//   });

//   const isError = ValidateBody(event, getEmployeeDataSchema, callback);

//   if (isError) return;

//   const { userId, preferencesObject } = JSON.parse(event.body);

//   var savedEmployee;

//   connectToDatabase().then(async () => {
//     let employeeObject;
//     try {
//       employeeObject = await Employee.findById(userId).exec();
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

//     employeeObject._doc.preferences = preferencesObject;
//     employeeObject.markModified('preferences');

//     try {
//       savedEmployee = await employeeObject.save();
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
//       body: JSON.stringify(savedEmployee._doc),
//     });
//   });
// };

// module.exports.updateMatchNotification = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateMatchNotification = Joi.object({
//     userId: Joi.string().required(),
//     accountType: Joi.string().required(),
//     matchId: Joi.string().required(),
//     hasNotification: Joi.boolean().required(),
//   });

//   const isError = ValidateBody(event, updateMatchNotification, callback);

//   if (isError) return;

//   const { userId, accountType, matchId, hasNotification } = JSON.parse(event.body);

//   connectToDatabase().then(async () => {
//     let saveObject;

//     if (accountType === 'employee') {
//       saveObject = await Employee.findById(userId).exec();
//     } else {
//       saveObject = await Job.findById(userId).exec();
//     }

//     if (!saveObject) {
//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({
//           message: 'updateMatchNotification: User not found',
//         }),
//       });
//       return;
//     }

//     const currentMatches = saveObject._doc.matches;
//     const foundIndex = currentMatches.findIndex((x) => x.id === matchId);
//     if (foundIndex >= 0) {
//       currentMatches[foundIndex].custom.hasNotification = hasNotification;
//     }
//     saveObject.markModified('matches');

//     try {
//       await saveObject.save();
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
//       body: JSON.stringify({ message: 'Success' }),
//     });
//   });
// };

// module.exports.updateMatchForBothOwners = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateMatchSchema = Joi.object({
//     userId: Joi.string().required(),
//     accountType: AccountTypeSchema,
//     matchToUpdate: TUpdateMatchSchema.required(),
//   });

//   const isError = ValidateBody(event, updateMatchSchema, callback);

//   if (isError) return;

//   if (event.body != null) {
//     const { userId, accountType, matchToUpdate } = JSON.parse(event.body);

//     let idsArray = matchToUpdate.id.split('-');
//     idsArray = idsArray.filter((name) => !name.includes(userId));

//     const otherUserId = idsArray[0];

//     connectToDatabase().then(async () => {
//       let loggedInUserObject;
//       let otherUserObject;
//       try {
//         if (accountType === AccountTypeEnum.employee) {
//           loggedInUserObject = await Employee.findById(userId).exec();
//           otherUserObject = await Job.findById(otherUserId).exec();
//         } else {
//           loggedInUserObject = await Job.findById(userId).exec();
//           otherUserObject = await Employee.findById(otherUserId).exec();
//         }
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }

//       if (!otherUserObject || !loggedInUserObject) {
//         return callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({
//             error: 'Account deleted error',
//           }),
//         });
//       }

//       const loggedInUserMatches = [...loggedInUserObject._doc.matches];
//       const loggedInUserIndex = loggedInUserMatches.findIndex((x) => x.id === matchToUpdate.id);
//       loggedInUserMatches[loggedInUserIndex] = {
//         ...loggedInUserMatches[loggedInUserIndex],
//         ...matchToUpdate,
//       };
//       loggedInUserObject._doc.matches = loggedInUserMatches;
//       loggedInUserObject.markModified('matches');

//       // only different thing we do between loggedInUserMatches above and otherUserMatches below
//       // is that below updates hasNotification for other user
//       const otherUserMatches: TMatch[] = [...otherUserObject._doc.matches];
//       const otherUserIndex = otherUserMatches.findIndex((x) => x.id === matchToUpdate.id);
//       // update hasNotification
//       if (otherUserIndex != -1) {
//         const otherUserMatchToUpdate: TMatch = {
//           ...matchToUpdate,
//           custom: {
//             ...otherUserMatches[otherUserIndex].custom,
//             hasNotification: true,
//           },
//         };
//         otherUserMatches[otherUserIndex] = {
//           ...otherUserMatches[otherUserIndex],
//           ...otherUserMatchToUpdate,
//         };
//         otherUserObject._doc.matches = otherUserMatches;
//         otherUserObject.markModified('matches');
//       }

//       try {
//         await loggedInUserObject.save();
//         await otherUserObject.save();
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({ message: 'match successfully updated' }),
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

// module.exports.updateOwnMatch = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateMatchSchema = Joi.object({
//     userId: Joi.string().required(),
//     accountType: AccountTypeSchema,
//     matchToUpdate: TUpdateMatchSchema.required(),
//   });

//   const isError = ValidateBody(event, updateMatchSchema, callback);

//   if (isError) return;

//   if (event.body != null) {
//     const { userId, accountType, matchToUpdate } = JSON.parse(event.body);

//     let idsArray = matchToUpdate.id.split('-');
//     idsArray = idsArray.filter((name) => !name.includes(userId));

//     connectToDatabase().then(async () => {
//       let loggedInUserObject;
//       try {
//         if (accountType === AccountTypeEnum.employee) {
//           loggedInUserObject = await Employee.findById(userId).exec();
//         } else {
//           loggedInUserObject = await Job.findById(userId).exec();
//         }
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }

//       const loggedInUserMatches = [...loggedInUserObject._doc.matches];
//       const loggedInUserIndex = loggedInUserMatches.findIndex((x) => x.id === matchToUpdate.id);
//       // spread the custom object out so it doesnt wipe and replace everything
//       const tempMatchToUpdate = {
//         ...matchToUpdate,
//         custom: {
//           ...loggedInUserMatches[loggedInUserIndex].custom,
//           ...matchToUpdate.custom,
//         },
//       };
//       loggedInUserMatches[loggedInUserIndex] = {
//         ...loggedInUserMatches[loggedInUserIndex],
//         ...tempMatchToUpdate,
//       };
//       loggedInUserObject._doc.matches = loggedInUserMatches;
//       loggedInUserObject.markModified('matches');

//       try {
//         await loggedInUserObject.save();
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({ message: 'match successfully updated' }),
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

// module.exports.deleteMatch = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const deleteMatchSchema = Joi.object({
//     userId: Joi.string().required(),
//     accountType: AccountTypeSchema,
//     matchToDeleteId: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, deleteMatchSchema, callback);

//   if (isError) return;

//   if (event.body != null) {
//     const { userId, accountType, matchToDeleteId } = JSON.parse(event.body);

//     connectToDatabase().then(async () => {
//       let loggedInUserObject;
//       try {
//         if (accountType === AccountTypeEnum.employee) {
//           loggedInUserObject = await Employee.findById(userId).exec();
//         } else {
//           loggedInUserObject = await Job.findById(userId).exec();
//         }
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }

//       const loggedInUserMatches = [...loggedInUserObject._doc.matches];

//       const filteredMatches = loggedInUserMatches.filter((el) => {
//         return el.id != matchToDeleteId;
//       });

//       loggedInUserObject._doc.matches = filteredMatches;
//       loggedInUserObject.markModified('matches');

//       try {
//         await loggedInUserObject.save();
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({
//             message: 'match successfully deleted',
//             matches: filteredMatches,
//           }),
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

// module.exports.addMatch = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const addUserMatchSchema = Joi.object({
//     accountType: AccountTypeSchema,
//     loggedInUserMatch: TMatchSchema.required(),
//     otherUserMatch: TMatchSchema.required(),
//   });

//   const isError = ValidateBody(event, addUserMatchSchema, callback);

//   if (isError) return;

//   if (event.body != null) {
//     const { accountType, loggedInUserMatch, otherUserMatch } = JSON.parse(event.body);

//     // the match id is the loggedInUsersId with a dash then the otherUsersId
//     // so here we get both by splitting the matchId string by dash
//     const loggedInUserId = loggedInUserMatch.id.split('-')[0];
//     const otherUserId = loggedInUserMatch.id.split('-')[1];

//     const isEmployee = accountType === AccountTypeEnum.employee;

//     connectToDatabase().then(async () => {
//       let loggedInUserObject;
//       let otherUserObject;
//       try {
//         if (isEmployee) {
//           loggedInUserObject = await Employee.findById(loggedInUserId).exec();
//           otherUserObject = await Job.findById(otherUserId).exec();
//         } else {
//           loggedInUserObject = await Job.findById(loggedInUserId).exec();
//           otherUserObject = await Employee.findById(otherUserId).exec();
//         }
//       } catch (err) {
//         console.error(err);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: err }),
//         });
//       }

//       const assignColor = (matches: TMatch[]) => {
//         if (matches && matches.length > 0) {
//           const colorsArray = colors;
//           const lastFiveJobs = matches.slice(-5);
//           const latestFiveColors = lastFiveJobs.map((match: TMatch) => match.custom.employeeColor);
//           let newColor = '';
//           colorsArray.forEach((color) => {
//             if (!latestFiveColors.includes(color)) {
//               newColor = color;
//             }
//           });
//           if (!newColor) {
//             newColor = latestFiveColors[0];
//           }
//           return newColor;
//         } else {
//           return '#acfcf2';
//         }
//       };

//       const tempLoggedInUserMatch = { ...loggedInUserMatch };

//       tempLoggedInUserMatch.custom.employeeColor = assignColor(loggedInUserObject._doc.matches);

//       // update matches array
//       const loggedInUserMatches = [...loggedInUserObject._doc.matches, tempLoggedInUserMatch];

//       loggedInUserObject._doc.matches = loggedInUserMatches;
//       loggedInUserObject.markModified('matches');

//       const tempOtherUserMatch = { ...otherUserMatch };

//       tempOtherUserMatch.custom.employeeColor = assignColor(otherUserObject._doc.matches);

//       const otherUserMatches = [...otherUserObject._doc.matches, tempOtherUserMatch];
//       otherUserObject._doc.matches = otherUserMatches;
//       otherUserObject.markModified('matches');

//       // remove matched persons ID from received likes array
//       const loggedInUserReceivedLikes = loggedInUserObject.receivedLikes.filter((e) => e !== otherUserId);
//       loggedInUserObject._doc.receivedLikes = loggedInUserReceivedLikes;
//       loggedInUserObject.markModified('receivedLikes');

//       const otherUserReceivedLikes = otherUserObject.receivedLikes.filter((e) => e !== loggedInUserId);
//       otherUserObject._doc.receivedLikes = otherUserReceivedLikes;
//       otherUserObject.markModified('receivedLikes');

//       try {
//         await loggedInUserObject.save();
//         await otherUserObject.save();

//         // if isEmployee than otherUserObject is a job which has ownerEmail otherwise, employees just have email field
//         const receiverEmail = isEmployee ? otherUserObject.ownerEmail : otherUserObject.email;

//         if (receiverEmail) {
//           if (isEmployee) {
//             const matchesLinkStringified = JSON.stringify('https://keepertechjobs.io/employerHome/matches');
//             const jobTemplateData = `{ \"matchespagelink\":${matchesLinkStringified}}`;

//             let emailParams = {
//               Source: SENDER_EMAIL,
//               Template: 'YouReceivedAMatchJobTemplate',
//               Destination: {
//                 ToAddresses: [receiverEmail],
//               },
//               TemplateData: jobTemplateData,
//             };

//             await new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(emailParams).promise();
//           } else {
//             const matchesLinkStringified = JSON.stringify('https://keepertechjobs.io/employeeHome/matches');
//             const employeeTemplateData = `{ \"matchespagelink\":${matchesLinkStringified}}`;

//             let emailParams = {
//               Source: SENDER_EMAIL,
//               Template: 'YouReceivedAMatchEmployeeTemplate',
//               Destination: {
//                 ToAddresses: [receiverEmail],
//               },
//               TemplateData: employeeTemplateData,
//             };

//             await new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(emailParams).promise();
//           }
//         }

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({
//             message: 'Success',
//             loggedInUserMatch: tempLoggedInUserMatch,
//             otherUserMatch: tempOtherUserMatch,
//           }),
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

// module.exports.updateUserSettings = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const updateUserSettingsSchema = Joi.object({
//     userId: Joi.string(),
//     accountType: AccountTypeSchema,
//     lastUpdatedOnWeb: Joi.boolean(),
//     isIncomplete: Joi.boolean(),
//     newSettings: Joi.any().required(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, updateUserSettingsSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     if (event.body != null) {
//       const { userId, accountType, newSettings, lastUpdatedOnWeb, isIncomplete } = JSON.parse(event.body);

//       // we pass searchRadius in settings even though it is not a part of settings,
//       // it is only in preferences. then we just delete it off the object here
//       const searchRadius = newSettings.searchRadius;
//       delete newSettings.searchRadius;

//       var savedUser;

//       const isEmployee = accountType === AccountTypeEnum.employee;

//       connectToDatabase().then(async () => {
//         let userObject;
//         try {
//           if (isEmployee) {
//             userObject = await Employee.findById(userId).exec();
//           } else {
//             userObject = await Job.findById(userId).exec();
//           }
//         } catch (err) {
//           console.error(err);

//           callback(null, {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({ message: err }),
//           });
//         }

//         let geoLocation = userObject._doc.geoLocation;

//         if (newSettings.address && newSettings?.address != userObject._doc.settings.address) {
//           geoLocation = newSettings?.address
//             ? await getGeoLocationFromAddress(newSettings?.address)
//             : userObject._doc.geoLocation;

//           if (geoLocation) {
//             userObject._doc.geoLocation = geoLocation;
//             userObject.markModified('geoLocation');
//           }
//         }

//         if (isEmployee) {
//           if (newSettings?.educationHistory) {
//             // get highest degree from educationHistory and update education field
//             let bestDegree = 0;

//             const educationHistory = userObject?._doc?.settings.educationHistory
//               ? [...userObject?._doc?.settings.educationHistory]
//               : [];

//             educationHistory.map((educationItem: TEmployeeEducation) => {
//               if (EducationEnum[educationItem.degree] > bestDegree) {
//                 bestDegree = EducationEnum[educationItem.degree];
//               }
//             });
//             userObject._doc.education = bestDegree;
//             userObject.markModified('education');
//           }

//           // if (newSettings?.jobHistory) {
//           //   // set years of experience based on the dates from job history
//           //   const jobHistory = newSettings?.jobHistory;

//           //   if (jobHistory.length > 0) {
//           //     userObject._doc.yearsOfExperience = getYearsOfExperienceFromJobHistory(jobHistory);
//           //   } else {
//           //     userObject._doc.yearsOfExperience = 0;
//           //   }
//           //   userObject.markModified('yearsOfExperience');
//           // }
//         }

//         // update settings
//         let updatedSettings = { ...userObject._doc.settings, ...newSettings };
//         userObject._doc.settings = updatedSettings;
//         userObject.markModified('settings');

//         const currentPreferences = userObject._doc.preferences;

//         let preferencesObject;

//         // we make these functions because somehow isRemote was getting left blank which deletes it
//         // as a field from the users preferences object which makes them unable to login
//         // so now it is forced to return a boolean no matter what
//         const returnIsRemoteEmployee = () => {
//           if (
//             newSettings &&
//             newSettings?.onSiteOptionsOpenTo &&
//             !newSettings?.onSiteOptionsOpenTo?.includes('Remote')
//           ) {
//             return false;
//           } else {
//             return true;
//           }
//         };
//         const returnIsRemoteEmployer = () => {
//           if (newSettings && newSettings?.onSiteSchedule && newSettings?.onSiteSchedule !== 'Remote') {
//             return false;
//           } else {
//             return true;
//           }
//         };

//         // update preferences
//         if (isEmployee) {
//           preferencesObject = {
//             searchRadius: searchRadius || 50,
//             requiredYearsOfExperience: newSettings.yearsOfExperience || 0,
//             geoLocation: geoLocation || currentPreferences.geoLocation,
//             isNew: !!isIncomplete,
//             relevantSkills: userObject._doc.settings.relevantSkills || [],
//             isRemote: returnIsRemoteEmployee(),
//           } as TEmployeePreferences;
//         } else {
//           preferencesObject = {
//             searchRadius: searchRadius || 50,
//             yearsOfExperience: newSettings.requiredYearsOfExperience || 0,
//             geoLocation: geoLocation || currentPreferences.geoLocation,
//             relevantSkills: newSettings.relevantSkills || [],
//             isRemote: returnIsRemoteEmployer(),
//             frontendBackendOptionsOpenTo: currentPreferences.frontendBackendOptionsOpenTo,
//             companySizeOptionsOpenTo: currentPreferences.companySizeOptionsOpenTo,
//             employmentTypeOptionsOpenTo: currentPreferences.employmentTypeOptionsOpenTo,
//             workAuthOptionsOpenTo: currentPreferences.workAuthOptionsOpenTo,
//           } as TJobPreferences;
//         }

//         userObject._doc.preferences = preferencesObject;
//         userObject.markModified('preferences');

//         let itemsForSwiping;

//         if (isEmployee && !isIncomplete) {
//           itemsForSwiping = await axios
//             .post(process.env.ROOT_URL + '/getJobsForSwiping', {
//               'userId': userId,
//               'preferences': preferencesObject,
//             })
//             .catch((err) => {
//               console.error('There was an error getting jobs for swiping after updatingUserSettings: ' + err);
//               callback(new Error(err));
//             });
//         }

//         try {
//           userObject._doc.lastUpdatedOnWeb = lastUpdatedOnWeb;
//           userObject.markModified('lastUpdatedOnWeb');
//           savedUser = await userObject.save();
//         } catch (err) {
//           console.error(err);

//           callback(null, {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({ message: err }),
//           });
//         }

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({
//             itemsForSwiping: itemsForSwiping && itemsForSwiping.data ? itemsForSwiping.data : [],
//             userData: savedUser._doc,
//           }),
//         });
//       });
//     }
//   }
// };

// module.exports.updateUserData = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const getUserDataSchema = Joi.object({
//     userId: Joi.string(),
//     accountType: AccountTypeSchema,
//     updateObject: Joi.any(),
//     isPing: Joi.boolean(),
//     // {'isNew': false};
//   });

//   const isError = ValidateBody(event, getUserDataSchema, callback);

//   if (isError) return;

//   if (event?.body?.isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     if (event.body != null) {
//       const { userId, accountType, updateObject } = JSON.parse(event.body);

//       connectToDatabase().then(async () => {
//         try {
//           let res;
//           if (accountType === AccountTypeEnum.employee) {
//             res = await Employee.findByIdAndUpdate(userId, updateObject);
//           } else {
//             res = await Employer.findByIdAndUpdate(userId, updateObject);
//           }

//           callback(null, {
//             statusCode: 200,
//             headers,
//             body: JSON.stringify(res),
//           });
//         } catch (err) {
//           console.error(err);

//           callback(null, {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({ message: err }),
//           });
//         }
//       });
//     }
//   }
// };
// //end employee functions
