// 'use strict';
// require('dotenv').config({ path: '../variables.env' });

// import { v4 as uuid } from 'uuid';
// import { S3 } from 'aws-sdk';
// import * as Joi from 'joi';
// import ValidateBody from './validateBody';
// import { headers } from '../constants';
// import axios from 'axios';
// import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
// import * as PubNub from 'pubnub';
// import { PubnubNotificationMessageObjectSchema } from '../schemas/globalSchemas';
// import GrowthEngine from '../models/GrowthEngine';
// import connectToDatabase from '../db';
// import { TGrowthEngineEntry } from '../types/globalTypes';
// import Employee from '../models/Employee';
// import { TEmployee } from '../types/employeeTypes';
// import { coreSignalResumeTransformer } from '../utils/coreSignalUtils';

// const AWS = require('aws-sdk');

// const s3 = new S3();

// const coreSignalBaseUrl = 'https://api.coresignal.com/cdapi/v1/linkedin';
// const coreSignalApiKey = process.env.CORESIGNAL_API_KEY;

// AWS.config.update({ region: 'us-east-1' });

// const allowedMimes = ['image/jpeg', 'image/png', 'image/jpg'];

// // this gets just enough data for autocomplete
// module.exports.searchBrandFetch = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     searchValue: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { searchValue } = JSON.parse(event.body);

//   try {
//     const res = await axios
//       .get(`https://api.brandfetch.io/v2/search/${searchValue}`, {
//         headers: {
//           accept: 'application/json',
//         },
//       })
//       .then((response) => response.data);

//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify(res),
//     });
//   } catch (err) {
//     console.error(err);

//     callback(null, {
//       statusCode: 400,
//       headers,
//       body: JSON.stringify({ message: err }),
//     });
//   }
// };

// // this gets detailed data, there are not different search and collect tokens as with coreSignal,
// // instead, the search api is free and returns some minimal data instead of just IDs, and only
// // collect uses any tokens at all
// module.exports.collectBrandFetch = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     companyName: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { companyName } = JSON.parse(event.body);

//   const brandFetchApiKey = process.env.BRANDFETCH_API_KEY;

//   try {
//     const res = await axios
//       .get(`https://api.brandfetch.io/v2/brands/${companyName}`, {
//         headers: {
//           accept: 'application/json',
//           Authorization: `Bearer ${brandFetchApiKey}`,
//         },
//       })
//       .then((response) => response.data);

//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify(res),
//     });
//   } catch (err) {
//     console.error(err);

//     callback(null, {
//       statusCode: 400,
//       headers,
//       body: JSON.stringify({ message: err }),
//     });
//   }
// };
// // await Promise.all(sendEmailsPromiseArray);

// module.exports.loadCoreSignalDevsEnMasse = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     skill: Joi.string().required(),
//     limit: Joi.number().required(),
//   }).required();

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { skill, limit } = JSON.parse(event.body);

//   const filters = {
//     skill,
//     country: 'United States',
//     experience_company_industry: 'Computer Software',
//   };

//   connectToDatabase().then(async () => {
//     try {
//       // this takes filters and just returns array of Ids that you can then
//       // use to hit the collectCoreSignal call to get detailed information
//       // takes 1 search token to hit this call no matter how much is returned
//       let coreSignalIdsArray = await axios
//         .post(`${coreSignalBaseUrl}/member/search/filter`, filters, {
//           headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${coreSignalApiKey}`,
//           },
//         })
//         .then((response) => response.data);

//       coreSignalIdsArray = coreSignalIdsArray.slice(0, limit);

//       const coreSignalCollectLimit = limit;
//       if (coreSignalIdsArray && coreSignalIdsArray.length <= coreSignalCollectLimit) {
//         const collectCoreSignalPromisesArray: Promise<any>[] = [];

//         coreSignalIdsArray.forEach((coreSignalUserId: string) => {
//           collectCoreSignalPromisesArray.push(
//             axios
//               .get(`${coreSignalBaseUrl}/member/collect/${coreSignalUserId}`, {
//                 headers: {
//                   accept: 'application/json',
//                   Authorization: `Bearer ${coreSignalApiKey}`,
//                 },
//               })
//               .then((response) => response.data)
//           );
//         });

//         // this actually gets detailed data based on id
//         // can only send 1 id to get detailed info about 1 user at a time
//         // uses 1 collect credit each time

//         const collectAllRes = await Promise.all(collectCoreSignalPromisesArray);

//         const addNewEmployeesPromiseArray: Promise<any>[] = [];
//         collectAllRes.forEach((user) => {
//           const coreSignalTransformedResumeData = coreSignalResumeTransformer(user);

//           const newEmployee: TEmployee = {
//             phoneNumber: '123',
//             accountType: 'employee',
//             createdAt: new Date(),
//             lastUpdatedOnWeb: null,
//             email: 'bhad7778@gmail.com',
//             expoPushToken: null,
//             geoLocation: null,
//             receivedLikes: [],
//             hasGottenToEditProfileScreen: false,
//             hasReceivedLikeNotification: false,
//             matches: [],
//             settings: coreSignalTransformedResumeData,
//             // this is default set to cast the widest net possible, but as soon
//             // as user edits their profile, this will get updated accordingly
//             preferences: {
//               searchRadius: 50,
//               requiredYearsOfExperience: 5,
//               geoLocation: {
//                 type: 'Point',
//                 coordinates: [1, 2],
//               },
//               relevantSkills: [],
//               isRemote: true,
//               isNew: true,
//             },
//           };

//           addNewEmployeesPromiseArray.push(Employee.create(newEmployee));
//         });

//         try {
//           await Promise.all(addNewEmployeesPromiseArray);
//         } catch (error) {
//           console.error('Problem with addAllEmployeesPromise.all', error);

//           callback(null, {
//             statusCode: 400,
//             headers,
//             body: JSON.stringify({ message: 'Problem with addAllEmployeesPromise.all' + error }),
//           });
//         }

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({
//             message: 'success',
//           }),
//         });
//       }
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

// module.exports.searchAndCollectCoreSignal = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     fullName: Joi.string().required(),
//     companyName: Joi.string().required(),
//     isPing: Joi.boolean(),
//   }).required();

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { fullName, companyName, isPing } = JSON.parse(event.body);

//   if (isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const filters = {
//       name: fullName,
//       experience_company_name: companyName,
//       // keyword: 'software',
//       country: 'United States',
//     };

//     try {
//       // this takes filters and just returns array of Ids that you can then
//       // use to hit the collectCoreSignal call to get detailed information
//       // takes 1 search token to hit this call no matter how much is returned
//       const coreSignalIdsArray = await axios
//         .post(`${coreSignalBaseUrl}/search/filter`, filters, {
//           headers: {
//             accept: 'application/json',
//             Authorization: `Bearer ${coreSignalApiKey}`,
//           },
//         })
//         .then((response) => response.data);

//       const coreSignalCollectLimit = 5;
//       if (coreSignalIdsArray && coreSignalIdsArray.length <= coreSignalCollectLimit) {
//         const collectCoreSignalPromisesArray: Promise<any>[] = [];

//         coreSignalIdsArray.forEach((coreSignalUserId: string) => {
//           collectCoreSignalPromisesArray.push(
//             axios
//               .get(`${coreSignalBaseUrl}/collect/${coreSignalUserId}`, {
//                 headers: {
//                   accept: 'application/json',
//                   Authorization: `Bearer ${coreSignalApiKey}`,
//                 },
//               })
//               .then((response) => response.data)
//           );
//         });

//         // this actually gets detailed data based on Id
//         // can only send 1 id to get detailed info about 1 user at a time
//         // uses 1 collect credit each time
//         const collectAllRes = await Promise.all(collectCoreSignalPromisesArray);

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(collectAllRes),
//         });
//       }
//     } catch (err) {
//       console.error(err);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: err }),
//       });
//     }
//   }
// };

// module.exports.imageUpload = async (event) => {
//   const body = JSON.parse(event.body);

//   const imageUpload = Joi.object({
//     image: Joi.string().required(),
//     mime: Joi.string().required(),
//   });

//   const isError = ValidateBody(event, imageUpload);

//   if (isError) return;

//   try {
//     if (!allowedMimes.includes(body.mime.toLowerCase())) {
//       return {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: 'mime is not allowed ' }),
//       };
//     }

//     let imageData = body.image;
//     // if (body.image.substr(0, 7) === "base64,") {
//     //   imageData = body.image.substr(7, body.image.length);
//     // }
//     // const buffer = Buffer.from(imageData, "base64");

//     const decodedFile = Buffer.from(imageData.replace(/^data:image\/\w+;base64,/, ''), 'base64');

//     const name = uuid();
//     const key = `${name}.jpeg`;

//     const uploadResult = await s3
//       .upload({
//         Body: decodedFile,
//         Key: key,
//         ContentType: body.mime,
//         Bucket: 'keeper-image-bucket',
//         ACL: 'public-read',
//       })
//       .promise();

//     return {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({
//         img: uploadResult.Location,
//       }),
//     };
//   } catch (error) {
//     console.error('error', error);

//     return {
//       statusCode: 400,
//       headers,
//       body: JSON.stringify({
//         message: error.message || 'failed to upload image',
//       }),
//     };
//   }
// };

// module.exports.getGoogleMapsLocations = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     locationText: Joi.string().required(),
//     isPing: Joi.boolean(),
//   });

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { locationText, isPing } = JSON.parse(event.body);

//   if (isPing) {
//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify('Ping Successful'),
//     });
//   } else {
//     const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

//     try {
//       const locationRes = await axios.get(
//         `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${locationText}&types=geocode&key=${googleMapsApiKey}`
//       );

//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify(locationRes.data.predictions),
//       });
//     } catch (err) {
//       console.error(err);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: err }),
//       });
//     }
//   }
// };

// module.exports.sendPubnubNotification = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const params = Joi.object({
//     messageObject: PubnubNotificationMessageObjectSchema.required(),
//   });

//   const isError = ValidateBody(event, params);

//   if (isError) return;

//   const { messageObject } = JSON.parse(event.body);

//   const { data } = messageObject;

//   const { senderId, receiverId } = data;

//   const pubnubPublishKey = process.env.PUBNUB_PUBLISH_KEY;
//   const pubnubSubscribeKey = process.env.PUBNUB_SUBSCRIBE_KEY;

//   try {
//     const pubnub = new PubNub({
//       publishKey: pubnubPublishKey,
//       subscribeKey: pubnubSubscribeKey || '',
//       userId: senderId,
//     });

//     let isUserCurrentlyOnWebapp = false;

//     const checkIfDesktopUserIsCurrentlyOnline = async () => {
//       await pubnub.hereNow(
//         {
//           channels: [receiverId],
//         },
//         (status, response) => {
//           // does totalOccupancy mean for this channel or all channels?
//           // for some reason totalOccupancy is always 0
//           if (response.totalOccupancy > 0) {
//             isUserCurrentlyOnWebapp = true;
//           }
//         }
//       );
//     };
//     checkIfDesktopUserIsCurrentlyOnline();

//     const sendMobilePushNotiication = async () => {
//       // only send mobile push notification if user is not currently on webapp,
//       // because we do not want to blow up both the users phone and webapp if
//       // they currently are on the webapp
//       if (!isUserCurrentlyOnWebapp && messageObject.to != 'none' && messageObject.to != 'empty') {
//         try {
//           axios({
//             method: 'post',
//             url: 'https://exp.host/--/api/v2/push/send',
//             headers: {
//               Accept: 'application/json',
//               'Accept-encoding': 'gzip, deflate',
//               'Content-Type': 'application/json',
//             },
//             data: JSON.stringify(messageObject),
//           });
//         } catch (error) {
//           console.error('Error with sending mobile push notification ', error);
//         }
//       }
//     };
//     sendMobilePushNotiication();

//     const sendWebPushNotification = async () => {
//       // this sends to webapp, and webapp subscribes to
//       // loggedinUsers Id and here we publish to that id
//       try {
//         pubnub.publish({
//           channel: receiverId,
//           message: data,
//         });
//       } catch (error) {
//         console.error('Error with pubnub.publish- ', error);
//       }
//     };
//     sendWebPushNotification();

//     callback(null, {
//       statusCode: 200,
//       headers,
//       body: JSON.stringify({ response: 'Successfully sent push notification' }),
//     });
//   } catch (err) {
//     console.error(err);

//     callback(null, {
//       statusCode: 400,
//       headers,
//       body: JSON.stringify({ message: err }),
//     });
//   }
// };

// module.exports.sendGrowthEngineEmailsCron = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase().then(async () => {
//     const allEntries: TGrowthEngineEntry[] = await GrowthEngine.find({ hasReceivedEmail: false }).exec();

//     if (allEntries && allEntries.length > 0) {
//       let jobDestinationsArray: any = [];
//       let employeeDestinationsArray: any = [];
//       let onlyEmailsDestinationsArray: any[] = [];

//       allEntries.map((entry: TGrowthEngineEntry) => {
//         if (entry.accountType === 'employer') {
//           const discoverLink = JSON.stringify(
//             `https://keepertechjobs.io/browse/discover/employer/${entry.yearsOfExperience}/${entry.mainSkill}`
//           );

//           jobDestinationsArray.push({
//             'Destination': {
//               'ToAddresses': [entry.email],
//             },
//             'ReplacementTemplateData': `{ \"firstname\":${entry.firstName}, \"yearsofexperience\": ${entry.yearsOfExperience}, \"mainskill\":${entry.mainSkill}, \"discoverlink\": ${discoverLink}}`,
//           });
//         } else if (entry.accountType === 'employee') {
//           const discoverLink = JSON.stringify(
//             `https://keepertechjobs.io/browse/discover/employee/${entry.yearsOfExperience}/${entry.mainSkill}`
//           );

//           employeeDestinationsArray.push({
//             'Destination': {
//               'ToAddresses': [entry.email],
//             },
//             'ReplacementTemplateData': `{ \"firstname\":${entry.firstName}, \"yearsofexperience\":${entry.yearsOfExperience}, \"mainskill\":${entry.mainSkill}, \"discoverlink\":${discoverLink}}`,
//           });
//         } else if (!entry.accountType) {
//           onlyEmailsDestinationsArray.push({
//             'Destination': {
//               'ToAddresses': [entry.email],
//             },
//             'ReplacementTemplateData': `{ \"landingsitelink\":"https://www.keepertechjobs.com/" }`,
//           });
//         }
//       });

//       const sendEmailsPromiseArray: any[] = [];

//       try {
//         // send job emails, have to batch into batches of 50 because destinations array can only be 50
//         while (jobDestinationsArray.length > 0 && jobDestinationsArray.length <= 50) {
//           // grab first up to 50 destinations
//           const tempUpTo50DestinationsArray = jobDestinationsArray.slice(0, 50);
//           const jobParams = {
//             Source: 'bryan@keepertechjobs.com',
//             Template: 'JobGrowthEngineTemplate',
//             ConfigurationSetName: 'GrowthEngineConfig',
//             Destinations: tempUpTo50DestinationsArray,
//             DefaultTemplateData:
//               '{ "discoverlink":"https://www.keepertechjobs.com/", "firstname":"you", "mainskill":"javascript", "yearsofexperience":"5" }',
//           };

//           sendEmailsPromiseArray.push(
//             new AWS.SES({ apiVersion: '2010-12-01' }).sendBulkTemplatedEmail(jobParams).promise()
//           );

//           // cut 50 off of original array and do again if above while conditions are met
//           jobDestinationsArray = jobDestinationsArray.slice(50);
//         }

//         // send employee emails
//         while (employeeDestinationsArray.length > 0 && employeeDestinationsArray.length <= 50) {
//           // grab first up to 50 destinations
//           const tempUpTo50DestinationsArray = employeeDestinationsArray.slice(0, 50);
//           const employeeParams = {
//             Source: 'bryan@keepertechjobs.com',
//             Template: 'EmployeeGrowthEngineTemplate',
//             ConfigurationSetName: 'GrowthEngineConfig',
//             Destinations: tempUpTo50DestinationsArray,
//             DefaultTemplateData:
//               '{ "discoverlink":"https://www.keepertechjobs.com/", "firstname":"you", "mainskill":"javascript", "yearsofexperience":"5" }',
//           };

//           sendEmailsPromiseArray.push(
//             new AWS.SES({ apiVersion: '2010-12-01' }).sendBulkTemplatedEmail(employeeParams).promise()
//           );

//           // cut 50 off of original array and do again if above while conditions are met
//           employeeDestinationsArray = employeeDestinationsArray.slice(50);
//         }

//         // send only email emails
//         while (onlyEmailsDestinationsArray.length > 0 && onlyEmailsDestinationsArray.length <= 50) {
//           // grab first up to 50 destinations
//           const tempUpTo50DestinationsArray = onlyEmailsDestinationsArray.slice(0, 50);
//           const onlyEmailParams = {
//             Source: 'bryan@keepertechjobs.com',
//             Template: 'OnlyEmailGrowthEngineTemplate',
//             ConfigurationSetName: 'GrowthEngineConfig',
//             Destinations: tempUpTo50DestinationsArray,
//             DefaultTemplateData: '{ "landingsitelink":"https://www.keepertechjobs.com/" }',
//           };

//           sendEmailsPromiseArray.push(
//             new AWS.SES({ apiVersion: '2010-12-01' }).sendBulkTemplatedEmail(onlyEmailParams).promise()
//           );

//           // cut 50 off of original array and do again if above while conditions are met
//           onlyEmailsDestinationsArray = onlyEmailsDestinationsArray.slice(50);
//         }

//         await Promise.all(sendEmailsPromiseArray);

//         // update everything in db with hasReceivedEmail: false to have hasReceivedEmail: true,
//         // because we just grabbed everything in db with hasReceivedEmail: false and sent them emails
//         await GrowthEngine.updateMany({ hasReceivedEmail: false }, { $set: { hasReceivedEmail: true } });

//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify({
//             message: 'success',
//           }),
//         });
//       } catch (error) {
//         console.error(error, error.stack);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({
//             message: 'failed to send job emails' + error.message,
//           }),
//         });
//       }
//     } else {
//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({
//           message: 'Every entry in database has already received an email',
//         }),
//       });
//     }
//   });
// };

// module.exports.getGrowthEngineEntries = (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   connectToDatabase().then(async () => {
//     try {
//       const allEntries: TGrowthEngineEntry[] = await GrowthEngine.find({ hasReceivedEmail: false }).exec();

//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify(allEntries),
//       });
//     } catch (error) {
//       console.error(error, error.stack);

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({
//           message: 'failed to send job emails' + error.message,
//         }),
//       });
//     }
//   });
// };

// module.exports.addGrowthEngineEntry = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
//   context.callbackWaitsForEmptyEventLoop = false;

//   const addGrowthEngineEntrySchema = Joi.object({
//     email: Joi.string().required(),
//     firstName: Joi.string().allow(''),
//     accountType: Joi.string().allow(''),
//     yearsOfExperience: Joi.string().allow(''),
//     mainSkill: Joi.string().allow(''),
//   });

//   const isError = ValidateBody(event, addGrowthEngineEntrySchema, callback);

//   if (isError) return;

//   const newEntry = event && event.body ? JSON.parse(event.body) : '';

//   connectToDatabase().then(() => {
//     newEntry.hasReceivedEmail = false;

//     GrowthEngine.create(newEntry)
//       .then((res) => {
//         callback(null, {
//           statusCode: 200,
//           headers,
//           body: JSON.stringify(res),
//         });
//       })
//       .catch((error) => {
//         console.error(error, error.stack);
//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({
//             message: 'failed to send job emails' + error.message,
//           }),
//         });
//       });
//   });
// };

// // there is a case where if both users open the app at the same time and swipe right on each other,
// // they will not match, because when user opens app initially or when user brings app to the foreground,
// // we update that users received likes, so if two users both bring app to foreground at the same time, and then
// // swipe right on each other before backgrounding and foregrounding app again, then the match will be missed. So,
// // this is a catch-all for not letting any matches slip through
// // module.exports.createLooseMatchesCronJob = async (event) => {
// // this needs to be a batch get
// //   const allEmployees = await Employee.find().exec();
// // };
