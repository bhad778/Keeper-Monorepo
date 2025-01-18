let env: Record<string, string> = {};

// Environment detection
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
const isReactNative = typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
const isWeb = !isNode && typeof window !== 'undefined' && typeof document !== 'undefined';

if (isReactNative) {
  // React Native: Use expo-constants
  const Constants = require('expo-constants').default;
  env = Constants.expoConfig?.extra || {};
} else if (isNode) {
  // Node.js: Use dotenv to load environment variables
  const dotenv = require('dotenv');
  const path = require('path');

  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

  // Map environment variables with VITE_ prefixes to regular keys for consistency
  env = {
    API_URL: process.env.VITE_API_URL || '',
    AFFINDA_KEY: process.env.VITE_AFFINDA_KEY || '',
    AFFINDA_WORKSPACE_ID: process.env.VITE_AFFINDA_WORKSPACE_ID || '',
    GOOGLE_MAPS_ROOT_URL:
      process.env.VITE_GOOGLE_MAPS_ROOT_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    GOOGLE_MAPS_API_KEY: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    PUBNUB_PUBLISH_KEY: process.env.VITE_PUBNUB_PUBLISH_KEY || '',
    PUBNUB_SUBSCRIBE_KEY: process.env.VITE_PUBNUB_SUBSCRIBE_KEY || '',
    BRANDFETCH_API_KEY: process.env.VITE_BRANDFETCH_API_KEY || '',
    DB: process.env.VITE_DB || '',
    CORESIGNAL_API_KEY: process.env.VITE_CORESIGNAL_API_KEY || '',
    BRIGHTDATA_API_KEY: process.env.VITE_BRIGHTDATA_API_KEY || '',
    JOBS_QUEUE_URL: process.env.VITE_JOBS_QUEUE_URL || '',
    GEOLOCATION_QUEUE_URL: process.env.VITE_GEOLOCATION_QUEUE_URL || '',
    SOURCE_WEBSITE_COMPANIES_QUEUE_URL: process.env.VITE_SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_COMPANIES_QUEUE_URL: process.env.VITE_GLASSDOOR_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_REVIEWS_QUEUE_URL: process.env.VITE_GLASSDOOR_REVIEWS_QUEUE_URL || '',
    CRUNCHBASE_COMPANIES_QUEUE_URL: process.env.VITE_CRUNCHBASE_COMPANIES_QUEUE_URL || '',
  };
} else if (isWeb) {
  // Web: Use Vite's import.meta.env
  env = {
    API_URL: import.meta.env.VITE_API_URL || '',
    AFFINDA_KEY: import.meta.env.VITE_AFFINDA_KEY || '',
    AFFINDA_WORKSPACE_ID: import.meta.env.VITE_AFFINDA_WORKSPACE_ID || '',
    GOOGLE_MAPS_ROOT_URL:
      import.meta.env.VITE_GOOGLE_MAPS_ROOT_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    PUBNUB_PUBLISH_KEY: import.meta.env.VITE_PUBNUB_PUBLISH_KEY || '',
    PUBNUB_SUBSCRIBE_KEY: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY || '',
    BRANDFETCH_API_KEY: import.meta.env.VITE_BRANDFETCH_API_KEY || '',
    DB: import.meta.env.VITE_DB || '',
    CORESIGNAL_API_KEY: import.meta.env.VITE_CORESIGNAL_API_KEY || '',
    BRIGHTDATA_API_KEY: import.meta.env.VITE_BRIGHTDATA_API_KEY || '',
    JOBS_QUEUE_URL: import.meta.env.VITE_JOBS_QUEUE_URL || '',
    GEOLOCATION_QUEUE_URL: import.meta.env.VITE_GEOLOCATION_QUEUE_URL || '',
    SOURCE_WEBSITE_COMPANIES_QUEUE_URL: import.meta.env.VITE_SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_COMPANIES_QUEUE_URL: import.meta.env.VITE_GLASSDOOR_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_REVIEWS_QUEUE_URL: import.meta.env.VITE_GLASSDOOR_REVIEWS_QUEUE_URL || '',
    CRUNCHBASE_COMPANIES_QUEUE_URL: import.meta.env.VITE_CRUNCHBASE_COMPANIES_QUEUE_URL || '',
  };
}

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
