import * as dotenv from 'dotenv';
import * as path from 'path';
// Load environment variables from the root .env file

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

interface EnvConfig {
  apiUrl: string;
  affindaKey: string;
  affindaWorkspaceId: string;
  googleMapsRootUrl: string;
  googleMapsApiKey: string;
  pubnubPublishKey: string;
  pubnubSubscribeKey: string;
  brandFetchApiKey: string;
  db: string;
  coreSignalApiKey: string;
  brightDataApiKey: string;
  jobsQueueUrl: string;
  geoLocationQueueUrl: string;
  sourceWebsiteCompaniesQueueUrl: string;
  glassdoorCompaniesQueueUrl: string;
  glassdoorReviewsQueueUrl: string;
  crunchbaseCompaniesQueueUrl: string;
}

const env: EnvConfig = {
  apiUrl: process.env.API_URL || '',
  affindaKey: process.env.AFFINDA_KEY || '',
  affindaWorkspaceId: process.env.AFFINDA_WORKSPACE_ID || '',
  googleMapsRootUrl: process.env.GOOGLE_MAPS_ROOT_URL || '',
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
  pubnubPublishKey: process.env.PUBNUB_PUBLISH_KEY || '',
  pubnubSubscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || '',
  brandFetchApiKey: process.env.BRANDFETCH_API_KEY || '',
  db: process.env.DB || '',
  coreSignalApiKey: process.env.CORESIGNAL_API_KEY || '',
  brightDataApiKey: process.env.BRIGHTDATA_API_KEY || '',
  jobsQueueUrl: process.env.JOBS_QUEUE_URL || '',
  geoLocationQueueUrl: process.env.GEOLOCATION_QUEUE_URL || '',
  sourceWebsiteCompaniesQueueUrl: process.env.SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
  glassdoorCompaniesQueueUrl: process.env.GLASSDOOR_COMPANIES_QUEUE_URL || '',
  glassdoorReviewsQueueUrl: process.env.GLASSDOOR_REVIEWS_QUEUE_URL || '',
  crunchbaseCompaniesQueueUrl: process.env.CRUNCHBASE_COMPANIES_QUEUE_URL || '',
};

export default env;

export const {
  apiUrl,
  affindaKey,
  affindaWorkspaceId,
  googleMapsRootUrl,
  googleMapsApiKey,
  pubnubPublishKey,
  pubnubSubscribeKey,
  brandFetchApiKey,
  db,
  coreSignalApiKey,
  brightDataApiKey,
  jobsQueueUrl,
  geoLocationQueueUrl,
  sourceWebsiteCompaniesQueueUrl,
  glassdoorCompaniesQueueUrl,
  glassdoorReviewsQueueUrl,
  crunchbaseCompaniesQueueUrl,
} = env;
