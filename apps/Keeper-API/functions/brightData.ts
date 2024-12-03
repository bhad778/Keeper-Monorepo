// 'use strict';
// require('dotenv').config({ path: '../variables.env' });

// import { headers } from '../constants';
// import axios from 'axios';
// import { APIGatewayEvent, APIGatewayProxyCallback, Context } from 'aws-lambda';
// import connectToDatabase from '../db';
// import Job from '../models/Job';
// import BrightDataSnapshot, { TBrightDataSnapshot } from '../models/BrightDataSnapshot';
// import { TJob } from '../types/employerTypes';
// import {
//   brightDataIndeedCompanyTransformer,
//   brightDataLinkedInCompanyTransformer,
//   indeedJobTransformer,
//   linkedInJobTransformer,
// } from '../utils/brightDataUtils';
// import Company, { TCompany } from '../models/Company';
// import {
//   BrightDataSnapshotTypeEnum,
//   JobSourceWebsiteEnum,
//   TBrightDataIndeedCompany,
//   TBrightDataIndeedJob,
//   TBrightDataLinkedInCompany,
//   TBrightDataLinkedInJob,
// } from '../types/brightDataTypes';

// const brightDataApiKey = process.env.BRIGHTDATA_API_KEY;

// const getLinkedInJobSnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_lpfll7v5hcqtkxl6l&type=discover_new&discover_by=url&limit_per_input=30';
// const getIndeedJobSnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l4dx9j9sscpvs7no2&type=discover_new&discover_by=keyword&limit_per_input=30';

// const getLinkedInCompanySnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vikfnt1wgvvqz95w&include_errors=true';
// const getIndeedCompanySnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7qekxkv2i7ve6hx1s&include_errors=true';

// // example input https://www.glassdoor.com/Search/results.htm?keyword=Apple
// const getGlassDoorCompanyInfoSnapshotUrl =
//   'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l7j0bx501ockwldaqf&include_errors=true&type=discover_new&discover_by=keyword';

// // this url searches jobs by "react developer" OR "java developer" OR "python developer" OR ".net developer" OR "typescript developer"
// // OR "angular developer", past week, all experience levels, remote and hybrid and onsite, only united states
// const linkedInFiltersUrl =
//   'https://www.linkedin.com/jobs/search/?currentJobId=3993683401&f_E=1%2C2%2C3%2C4&f_PP=102571732%2C102277331%2C106224388%2C103112676%2C104116203%2C100420597%2C102264677%2C104472865%2C102380872%2C104383890%2C106504367%2C104194190&f_TPR=r604800&f_WT=1%2C2%2C3&keywords=react%20jobs&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R';

// const BATCH_SIZE = 30;

// even steps have to wait 45 min or so after their predecssor is done, odd steps can be ran as soon as their predecessor is done.
// this is because odd steps add snapshots to the database, brightdata creates snapshots of data but it takes them time to process.
// so when creating a snapshot you tell it what data you want, it creates the snapshot and immedietly returns the snapshotId, but then
// you have to wait up to 45 min after to actually use the snapshotId to get the data
// begin step one
// in this step we add linkedin and indeed job listing snapshots to our db with addBrightDataLinkedInSnapshotToDb and addBrightDataIndeedSnapshotToDb
// module.exports.addLinkedInJobSnapshotToDb = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const filters = [
//     {
//       'url': linkedInFiltersUrl,
//     },
//   ];

//   connectToDatabase().then(() => {
//     axios
//       .post(getLinkedInJobSnapshotUrl, filters, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${brightDataApiKey}`,
//         },
//       })
//       .then((response) => {
//         const newEntryData: TBrightDataSnapshot = {
//           snapshotId: response.data.snapshot_id,
//           type: BrightDataSnapshotTypeEnum.JobListings,
//           sourceWebsite: JobSourceWebsiteEnum.LinkedIn,
//           createdAt: new Date(),
//         };
//         BrightDataSnapshot.create(newEntryData)
//           .then(() => {
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify({
//                 message: 'successfully add snapshotId to DB',
//               }),
//             });
//           })
//           .catch((error) => {
//             callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({
//                 message: `Problem with BrightDataSnapshot.create() ${error} in addLinkedInJobSnapshotToDb. Attempted to create entry with this data- ${newEntryData}`,
//               }),
//             });
//           });
//       })
//       .catch((error) => {
//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: 'Problem with addLinkedInJobSnapshotToDb' + error }),
//         });
//       });
//   });
// };

// // addLinkedInJobSnapshotToDb and addIndeedJobSnapshotToDb add,
// // only 1 snapshot each but each snapshot will have many jobs
// module.exports.addIndeedJobSnapshotToDb = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   const filters = [
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Atlanta, GA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Los Angeles, CA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'New York, NY' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Chicago, IL' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Austin, TX' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Boston, MA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Seattle, WA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'San Francisco, CA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Washington, DC' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Denver, CO' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Miami, FL' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'San Jose, CA' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Boulder, CO' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Durham, NC' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Bloomington, IL' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Huntsville, AL' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Charlotte, NC' },
//     { 'country': 'US', 'domain': 'indeed.com', 'keyword_search': 'software engineer', 'location': 'Baltimore, MD' },
//   ];

//   connectToDatabase().then(() => {
//     axios
//       .post(getIndeedJobSnapshotUrl, filters, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${brightDataApiKey}`,
//         },
//       })
//       .then((response) => {
//         const newEntryData: TBrightDataSnapshot = {
//           snapshotId: response.data.snapshot_id,
//           type: BrightDataSnapshotTypeEnum.JobListings,
//           sourceWebsite: JobSourceWebsiteEnum.Indeed,
//           createdAt: new Date(),
//         };
//         BrightDataSnapshot.create(newEntryData)
//           .then(() => {
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify({
//                 message: 'successfully add snapshotId to DB',
//               }),
//             });
//           })
//           .catch((error) => {
//             callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({
//                 message: `Problem with BrightDataSnapshot.create() ${error} in addIndeedJobSnapshotToDb. Attempted to create entry with this data- ${newEntryData}`,
//               }),
//             });
//           });
//       })
//       .catch((error) => {
//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: 'Problem with addIndeedJobSnapshotToDb' + error }),
//         });
//       });
//   });
// };
// // end step one

// // begin step two
// // in this step we load the data for those snapshots with loadBrightDataJobListingsFromSnapshots and populate DB with jobs
// module.exports.loadJobListingsFromSnapshots = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   // Helper function to split arrays into batches
//   const splitIntoBatches = <T>(array: T[], batchSize: number): T[][] => {
//     const batches: T[][] = [];
//     for (let i = 0; i < array.length; i += batchSize) {
//       batches.push(array.slice(i, i + batchSize));
//     }
//     return batches;
//   };

//   await connectToDatabase();
//   try {
//     const snapshots = await BrightDataSnapshot.find({
//       type: BrightDataSnapshotTypeEnum.JobListings,
//     });

//     if (!snapshots || snapshots.length === 0) {
//       return callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: 'No snapshots found' }),
//       });
//     }

//     const brightDataPromisesArray: { promise: Promise<any>; sourceWebsite: JobSourceWebsiteEnum }[] = [];
//     const snapshotIdsToDelete: string[] = [];

//     // Prepare the API call promises and associated metadata
//     snapshots.forEach((snapshotDbItem) => {
//       if (snapshotDbItem?.snapshotId) {
//         snapshotIdsToDelete.push(snapshotDbItem.snapshotId);
//         brightDataPromisesArray.push({
//           promise: axios
//             .get(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotDbItem.snapshotId}?format=json`, {
//               headers: {
//                 accept: 'application/json',
//                 Authorization: `Bearer ${brightDataApiKey}`,
//               },
//             })
//             .then((res) => res.data)
//             .catch((error) => {
//               console.error(`Error fetching snapshot ${snapshotDbItem.snapshotId}:`, error);
//               return null; // Return null for failed requests
//             }),
//           sourceWebsite: snapshotDbItem.sourceWebsite as JobSourceWebsiteEnum,
//         });
//       }
//     });

//     // Split the promises into batches
//     const promiseBatches = splitIntoBatches(brightDataPromisesArray, BATCH_SIZE);

//     const snapShotDataWithSourceSiteArray: {
//       jobsArray: TBrightDataLinkedInJob[] | TBrightDataIndeedJob[];
//       sourceWebsite: JobSourceWebsiteEnum;
//     }[] = [];

//     // Process each batch sequentially
//     for (const batch of promiseBatches) {
//       const responses = await Promise.all(batch.map((item) => item.promise));
//       responses.forEach((snapShotData, index) => {
//         if (snapShotData) {
//           snapShotDataWithSourceSiteArray.push({
//             jobsArray: snapShotData,
//             sourceWebsite: batch[index].sourceWebsite,
//           });
//         }
//       });
//     }

//     // Check if snapshots are ready
//     if (snapShotDataWithSourceSiteArray.some((item) => item.jobsArray?.status === 'running')) {
//       console.error('Snapshot is not ready yet, try again in 10s');
//       return callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: 'Snapshots are not ready yet, try again in 10s' }),
//       });
//     }

//     const transformedBrightDataJobs: TJob[] = [];

//     // Transform jobs into the required shape
//     snapShotDataWithSourceSiteArray.forEach((snapShotDataWithSourceSite) => {
//       if (snapShotDataWithSourceSite.jobsArray) {
//         snapShotDataWithSourceSite.jobsArray.forEach((brightDataJob: TBrightDataLinkedInJob | TBrightDataIndeedJob) => {
//           if (brightDataJob.apply_link) {
//             if (snapShotDataWithSourceSite.sourceWebsite === JobSourceWebsiteEnum.Indeed) {
//               transformedBrightDataJobs.push(indeedJobTransformer(brightDataJob as TBrightDataIndeedJob));
//             } else if (snapShotDataWithSourceSite.sourceWebsite === JobSourceWebsiteEnum.LinkedIn) {
//               transformedBrightDataJobs.push(linkedInJobTransformer(brightDataJob as TBrightDataLinkedInJob));
//             }
//           }
//         });
//       }
//     });

//     // Insert all transformed jobs into the database
//     try {
//       await Job.insertMany(transformedBrightDataJobs);
//       await BrightDataSnapshot.deleteMany({ snapshotId: { $in: snapshotIdsToDelete } });

//       return callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({ message: 'Successfully added BrightData jobs to the database' }),
//       });
//     } catch (error) {
//       console.error('Error inserting jobs or deleting snapshots:', error);
//       return callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: `Error inserting jobs or deleting snapshots: ${error}` }),
//       });
//     }
//   } catch (error) {
//     console.error('Error in loadJobListingsFromSnapshots:', error);
//     return callback(null, {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ message: `Server error: ${error}` }),
//     });
//   }
// };

// // end step two

// // begin step three
// // source website meaning indeed, linkedInn etc. So here we use job.companyUrl to use
// // brightData get company info by URL to get the data for each company
// module.exports.addSourceWebsiteCompanyDetailsSnapshotsToDb = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   connectToDatabase().then(async () => {
//     // 3 days ago just to get the lastest batch of jobs that havent been updated with details yet
//     const threeDaysAgo = new Date();
//     threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

//     const newJobs: TJob[] = await Job.find({
//       createdAt: { $gte: threeDaysAgo },
//     });

//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     // get all companies that havent had a glassdoor update in 6 months
//     // or lastGlassDoorUpdate is undefined or null
//     const allCompanies: TCompany[] = await Company.find({
//       $or: [
//         { lastGlassDoorUpdate: { $lte: sixMonthsAgo } },
//         { lastGlassDoorUpdate: { $exists: false } },
//         { lastGlassDoorUpdate: null },
//       ],
//     });

//     const seenCompanyUrls = new Set<string>();

//     // loop over each job using companyName to see if we have that company in our db and it has reviews and hasnt been updated in 6 months
//     const addCompanyDetailsSnapshotsPromisesArray = newJobs?.reduce<Promise<any>[]>((acc, job) => {
//       const filters = [
//         {
//           // This is done for both LinkedIn and Indeed
//           'url': job.companyUrl,
//         },
//       ];

//       // Check if the company already exists in the database. job.companyUrl is its link to its sourceWebsite
//       // company details like linkedIn or indeed etc we use that url to call get company info by URL. Then we create
//       // the company object in db and company.sourceWebsiteUrl is set to the job.companyUrl of the job it was created from
//       // all companies were created from the job.companyUrl of a job listing, so the job.companyUrl, to company.sourceWebsiteUrl
//       // is how we connect those two things together
//       const companyObjectIfItExistsInOurDbAlready = allCompanies.find(
//         (company) => job.companyUrl === company.sourceWebsiteUrl
//       );

//       const isIndeedJob = job?.url?.toLowerCase().includes(`${JobSourceWebsiteEnum.Indeed}.com`.toLowerCase());
//       const isLinkedInJob = job?.url?.toLowerCase().includes(`${JobSourceWebsiteEnum.LinkedIn}.com`.toLowerCase());

//       // Check if we need to create or update a snapshot
//       if (!companyObjectIfItExistsInOurDbAlready && job.companyUrl && !seenCompanyUrls.has(job.companyUrl)) {
//         // Mark this companyUrl as seen
//         seenCompanyUrls.add(job.companyUrl);

//         // for now if its not an indeed or linked in job dont do anything with it
//         if (isIndeedJob) {
//           acc.push(
//             axios.post(getIndeedCompanySnapshotUrl, filters, {
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${brightDataApiKey}`,
//               },
//             })
//           );
//         } else if (isLinkedInJob) {
//           acc.push(
//             axios.post(getLinkedInCompanySnapshotUrl, filters, {
//               headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${brightDataApiKey}`,
//               },
//             })
//           );
//         }
//       }

//       return acc;
//     }, []); // Start with an empty array for the accumulator

//     Promise.all(addCompanyDetailsSnapshotsPromisesArray)
//       .then((arrayOfResponses) => {
//         const snapshotsArray: TBrightDataSnapshot[] = arrayOfResponses?.map((item: any) => {
//           return {
//             snapshotId: item?.data?.snapshot_id,
//             type: BrightDataSnapshotTypeEnum.SourceWebsiteCompanyDetails,
//             createdAt: new Date(),
//           };
//         });

//         BrightDataSnapshot.insertMany(snapshotsArray)
//           .then(() => {
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify({
//                 message: 'All comanyDetails snapshots added successfully',
//               }),
//             });
//           })
//           .catch((error) => {
//             const errorMessage = `Error adding comanyDetails snapshots in addSourceWebsiteCompanyDetailsSnapshotsToDb: ${error}`;

//             console.error(errorMessage);

//             callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({ message: errorMessage }),
//             });
//           });
//       })
//       .catch((error) => {
//         const errorMessage = `Error with promise.all in addSourceWebsiteCompanyDetailsSnapshotsToDb call: ${error}`;

//         console.error(errorMessage);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: errorMessage }),
//         });
//       });
//   });
// };
// // end step three

// // begin step four
// // in this step we load the data for company details from snapshots from step 3. That company info data gets put into companies collection.
// module.exports.loadSourceWebsiteCompanyDetailsFromSnapshots = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   try {
//     await connectToDatabase();

//     // Get snapshotIds from our DB
//     const snapshots = await BrightDataSnapshot.find({ type: BrightDataSnapshotTypeEnum.SourceWebsiteCompanyDetails });
//     const brightDataPromisesArray: Promise<any>[] = [];
//     const snapshotIdsToDelete: string[] = [];

//     snapshots.forEach((snapshotDbItem) => {
//       if (snapshotDbItem && snapshotDbItem.snapshotId) {
//         snapshotIdsToDelete.push(snapshotDbItem.snapshotId);
//       }
//       // Push the get bright data by snapshot calls into a promiseArray to do Promise.All later
//       brightDataPromisesArray.push(
//         axios
//           .get(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotDbItem.snapshotId}?format=json`, {
//             headers: {
//               accept: 'application/json',
//               Authorization: `Bearer ${brightDataApiKey}`,
//             },
//           })
//           .then((res) => res.data)
//           .catch((error) => {
//             console.error(`Error fetching snapshot ${snapshotDbItem.snapshotId}:`, error);
//             return null; // Return null for failed requests
//           })
//       );
//     });

//     if (brightDataPromisesArray[0]?.status === 'running') {
//       console.error('Snapshot is not ready yet, try again in 10s');

//       callback(null, {
//         statusCode: 400,
//         headers,
//         body: JSON.stringify({ message: 'Snapshots are not ready yet, try again in 10s' }),
//       });
//     } else {
//       const resultsArray: any[] = [];
//       for (let i = 0; i < brightDataPromisesArray.length; i += BATCH_SIZE) {
//         const batch = brightDataPromisesArray.slice(i, i + BATCH_SIZE);
//         const batchResults = await Promise.all(batch);
//         resultsArray.push(...batchResults.filter((result) => result !== null)); // Filter out null results
//       }

//       // Create the upsert updateOne operations for bulkWrite
//       const operations = resultsArray.reduce(
//         (acc, snapshotDataArray: [TBrightDataIndeedCompany] | [TBrightDataLinkedInCompany]) => {
//           if (snapshotDataArray && snapshotDataArray.length > 0) {
//             const companyData = snapshotDataArray[0];
//             const isIndeedJob = companyData?.url
//               ?.toLowerCase()
//               .includes(`${JobSourceWebsiteEnum.Indeed}.com`.toLowerCase());
//             const isLinkedInJob = companyData?.url
//               ?.toLowerCase()
//               .includes(`${JobSourceWebsiteEnum.LinkedIn}.com`.toLowerCase());

//             if (isIndeedJob) {
//               acc.push({
//                 updateOne: {
//                   filter: { companyWebsiteUrl: companyData.url },
//                   update: { $set: brightDataIndeedCompanyTransformer(companyData as TBrightDataIndeedCompany) },
//                   upsert: true,
//                 },
//               });
//             } else if (isLinkedInJob) {
//               acc.push({
//                 updateOne: {
//                   filter: { companyWebsiteUrl: companyData.url },
//                   update: {
//                     $set: brightDataLinkedInCompanyTransformer(companyData as TBrightDataLinkedInCompany),
//                   },
//                   upsert: true,
//                 },
//               });
//             }
//           }
//           return acc;
//         },
//         []
//       );

//       // Insert all the data into our DB
//       await Company.bulkWrite(operations);
//       console.log('Successfully added brightData companies to DB');

//       callback(null, {
//         statusCode: 200,
//         headers,
//         body: JSON.stringify({
//           message: 'successfully added brightData companies to DB',
//         }),
//       });
//     }
//   } catch (error) {
//     console.error('Error in loadSourceWebsiteCompanyDetailsFromSnapshots:', error);
//     callback(null, {
//       statusCode: 500,
//       headers,
//       body: JSON.stringify({ message: 'Internal Server Error' }),
//     });
//   }
// };

// // begin step five
// module.exports.addGlassdoorCompanyDetailsSnapshotsToDb = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   connectToDatabase().then(async () => {
//     const sixMonthsAgo = new Date();
//     sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

//     // get all companies that havent had a glassdoor update in 6 months
//     // or lastGlassDoorUpdate is undefined or null
//     const allCompanies: TCompany[] = await Company.find({
//       $or: [
//         { lastGlassDoorUpdate: { $lte: sixMonthsAgo } },
//         { lastGlassDoorUpdate: { $exists: false } },
//         { lastGlassDoorUpdate: null },
//       ],
//     });

//     // we search by name returning 5 results, and then we filter those 5 results to find
//     // the right one based on company.companyWebsiteUrl matching brightDataCompany.details_website
//     const addCompanyDetailsSnapshotsPromisesArray = allCompanies?.map((company) => {
//       const filters = [
//         {
//           'search_url': `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(
//             company?.companyName
//           )}`,
//           'max_search_results': 5,
//         },
//       ];

//       // returning adds it to addCompanyDetailsSnapshotsPromisesArray since were using .map
//       return axios.post(getGlassDoorCompanyInfoSnapshotUrl, filters, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${brightDataApiKey}`,
//         },
//       });
//     });

//     Promise.all(addCompanyDetailsSnapshotsPromisesArray)
//       .then((arrayOfResponses) => {
//         const snapshotsArray: TBrightDataSnapshot[] = arrayOfResponses?.map((item: any) => {
//           return {
//             snapshotId: item?.data?.snapshot_id,
//             type: BrightDataSnapshotTypeEnum.GlassdoorCompanyDetails,
//             createdAt: new Date(),
//           };
//         });

//         BrightDataSnapshot.insertMany(snapshotsArray)
//           .then(() => {
//             callback(null, {
//               statusCode: 200,
//               headers,
//               body: JSON.stringify({
//                 message: 'All comanyDetails snapshots added successfully',
//               }),
//             });
//           })
//           .catch((error) => {
//             callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({ message: `Error in addGlassdoorCompanyDetailsSnapshotsToDb: ${error}` }),
//             });
//           });
//       })
//       .catch((error) => {
//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({
//             message: `Error with promise.all in addGlassdoorCompanyDetailsSnapshotsToDb call: ${error}`,
//           }),
//         });
//       });
//   });
// };
// // end step five

// // start step six
// // url_reviews should be used if it exists or attempted to be created from the other urls by added Reviews in the url
// module.exports.loadGlassdoorCompanyDetailsFromSnapshots = async (
//   event: APIGatewayEvent,
//   context: Context,
//   callback: APIGatewayProxyCallback
// ) => {
//   connectToDatabase().then(async () => {
//     // get snapshotIds from our DB
//     BrightDataSnapshot.find({ type: BrightDataSnapshotTypeEnum.GlassdoorCompanyDetails })
//       .then((response) => {
//         const brightDataPromisesArray: Promise<any>[] = [];
//         if (response) {
//           const snapshotIdsToDelete: string[] = [];
//           response.map((snapshotDbItem) => {
//             if (snapshotDbItem && snapshotDbItem.snapshotId) {
//               snapshotIdsToDelete.push(snapshotDbItem.snapshotId);
//             }
//             // push the get bright data by snapshot calls into a promiseArray to do Promise.All later
//             brightDataPromisesArray.push(
//               axios
//                 .get(`https://api.brightdata.com/datasets/v3/snapshot/${snapshotDbItem.snapshotId}?format=json`, {
//                   headers: {
//                     accept: 'application/json',
//                     Authorization: `Bearer ${brightDataApiKey}`,
//                   },
//                 })
//                 .then((res) => res.data)
//             );
//           });

//           BrightDataSnapshot.deleteMany({ snapshotId: { $in: snapshotIdsToDelete } }).catch((error) => {
//             console.error('Error with BrightDataSnapshot.deleteMany' + error);

//             callback(null, {
//               statusCode: 400,
//               headers,
//               body: JSON.stringify({ message: error }),
//             });
//           });
//         }

//         // each snapshotId has its own call and we do them all at once, then push all the
//         // data from them into combinedDataFromEachSnapshot, resultsArray is an array, because promise.All, containing arrays
//         // of company data, up to the maximum amount specified in addBrightDataGlassDoorCompanyDetailsSnapshotsToDb
//         Promise.all(brightDataPromisesArray).then((resultsArray) => {
//           // first we push into the companies array only the first of the up to 5 companies per snapshot that is based in the US
//           // but we do this for all snapshots so after below code companiesArray will be a flat array of company objects, all based in the US
//           const companiesArray: TCompany[] = resultsArray.reduce((acc: TCompany[], companies: TCompany[]) => {
//             const usOnlyCompanies = companies.filter((company) => {
//               const headquarters = company.headquarters.toLowerCase();
//               return (
//                 headquarters.includes('united states') ||
//                 headquarters.includes('us') ||
//                 headquarters.match(
//                   /,?\s?(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)(?=\s|,|\b)/i // Positive lookahead ensures we match state abbreviations correctly
//                 )
//               );
//             });

//             if (usOnlyCompanies.length > 0) {
//               // only return the first US company if there area any,
//               acc.push(usOnlyCompanies[0]); // Only add if a US company is found
//             }
//             return acc;
//           }, []);

//           // now create the upsert updateOne operations that we will do an bulkWrite with
//           // each individual operation says, check if a company with this name exists in our DB,
//           // if it does update it and if not create a new document
//           const operations = companiesArray.map((companyData) => {
//             return {
//               updateOne: {
//                 filter: { company: new RegExp(`^${companyData.companyName}$`, 'i') }, // Case-insensitive filter
//                 update: { $set: companyData },
//                 upsert: true,
//               },
//             };
//           });

//           // then insert all the data into our DB
//           Company.bulkWrite(operations)
//             .then(() => {
//               callback(null, {
//                 statusCode: 200,
//                 headers,
//                 body: JSON.stringify({
//                   message: 'successfully added brightData companies to DB',
//                 }),
//               });
//             })
//             .catch((error) => {
//               console.error(`Error with Company.bulkWrite in loadBrightDataCompanyDetailsFromSnapshots: ${error}`);

//               callback(null, {
//                 statusCode: 400,
//                 headers,
//                 body: JSON.stringify({ message: error }),
//               });
//             });
//         });
//       })
//       .catch((error) => {
//         console.error(`Error with BrightDataSnapshot.find() in loadBrightDataCompanyDetailsFromSnapshots ${error}`);

//         callback(null, {
//           statusCode: 400,
//           headers,
//           body: JSON.stringify({ message: error }),
//         });
//       });
//   });
// };
// end step six
