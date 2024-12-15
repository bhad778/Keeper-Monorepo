import * as dotenv from 'dotenv';

// Load environment variables from the root .env file
dotenv.config();

interface EnvConfig {
  apiUrl: string;
  affindaKey: string;
  affindaWorkspaceId: string;
  googleMapsRootUrl: string;
  googleMapsApiKey: string;
  pubNubPublishKey: string;
  pubNubSubscribeKey: string;
  brandFetchApiKey: string;
  db: string;
  coreSignalApiKey: string;
  brightDataApiKey: string;
  jobsQueueUrl: string;
  geoLocationQueueUrl: string;
  sourceWebsiteCompaniesQueueUrl: string;
  glassdoorCompaniesQueueUrl: string;
  glassdoorReviewsQueueUrl: string;
}

const env: EnvConfig = {
  apiUrl: process.env.API_URL || '',
  affindaKey: process.env.AFFINDA_KEY || '',
  affindaWorkspaceId: process.env.AFFINDA_WORKSPACE_ID || '',
  googleMapsRootUrl: process.env.GOOGLE_MAPS_ROOT_URL || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  pubNubPublishKey: process.env.PUBNUB_PUBLISH_KEY || '',
  pubNubSubscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || '',
  brandFetchApiKey: process.env.BRANDFETCH_API_KEY || '',
  db: process.env.DB || '',
  coreSignalApiKey: process.env.CORESIGNAL_API_KEY || '',
  brightDataApiKey: process.env.BRIGHTDATA_API_KEY || '',
  jobsQueueUrl: process.env.JOBS_QUEUE_URL || '',
  geoLocationQueueUrl: process.env.GEOLOCATION_QUEUE_URL || '',
  sourceWebsiteCompaniesQueueUrl: process.env.SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
  glassdoorCompaniesQueueUrl: process.env.GLASSDOOR_COMPANIES_QUEUE_URL || '',
  glassdoorReviewsQueueUrl: process.env.GLASSDOOR_REVIEWS_QUEUE_URL || '',
};

export default env;

export const {
  apiUrl,
  affindaKey,
  affindaWorkspaceId,
  googleMapsRootUrl,
  googleMapsApiKey,
  pubNubPublishKey,
  pubNubSubscribeKey,
  brandFetchApiKey,
  db,
  coreSignalApiKey,
  brightDataApiKey,
  jobsQueueUrl,
  geoLocationQueueUrl,
  sourceWebsiteCompaniesQueueUrl,
  glassdoorCompaniesQueueUrl,
  glassdoorReviewsQueueUrl,
} = env;
