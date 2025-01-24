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
    apiUrl: process.env.VITE_API_URL || '',
    affindaKey: process.env.VITE_AFFINDA_KEY || '',
    affindaWorkspaceId: process.env.VITE_AFFINDA_WORKSPACE_ID || '',
    googleMapsRootUrl:
      process.env.VITE_GOOGLE_MAPS_ROOT_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    googleMapsApiKey: process.env.VITE_GOOGLE_MAPS_API_KEY || '',
    pubnubPublishKey: process.env.VITE_PUBNUB_PUBLISH_KEY || '',
    pubnubSubscribeKey: process.env.VITE_PUBNUB_SUBSCRIBE_KEY || '',
    brandFetchApiKey: process.env.VITE_BRANDFETCH_API_KEY || '',
    db: process.env.VITE_DB || '',
    coreSignalApiKey: process.env.VITE_CORESIGNAL_API_KEY || '',
    brightDataApiKey: process.env.VITE_BRIGHTDATA_API_KEY || '',
    jobsQueueUrl: process.env.VITE_JOBS_QUEUE_URL || '',
    geoLocationQueueUrl: process.env.VITE_GEOLOCATION_QUEUE_URL || '',
    sourceWebsiteCompaniesQueueUrl: process.env.VITE_SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    glassdoorCompaniesQueueUrl: process.env.VITE_GLASSDOOR_COMPANIES_QUEUE_URL || '',
    glassdoorReviewsQueueUrl: process.env.VITE_GLASSDOOR_REVIEWS_QUEUE_URL || '',
    crunchbaseCompaniesQueueUrl: process.env.VITE_CRUNCHBASE_COMPANIES_QUEUE_URL || '',
    staggerQueueUrl: process.env.STAGGER_QUEUE_URL || '',
  };
} else if (isWeb) {
  // Web: Use Vite's import.meta.env
  env = {
    apiUrl: import.meta.env.VITE_API_URL || '',
    affindaKey: import.meta.env.VITE_AFFINDA_KEY || '',
    affindaWorkspaceId: import.meta.env.VITE_AFFINDA_WORKSPACE_ID || '',
    googleMapsRootUrl:
      import.meta.env.VITE_GOOGLE_MAPS_ROOT_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    pubnubPublishKey: import.meta.env.VITE_PUBNUB_PUBLISH_KEY || '',
    pubnubSubscribeKey: import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY || '',
    brandFetchApiKey: import.meta.env.VITE_BRANDFETCH_API_KEY || '',
    db: import.meta.env.VITE_DB || '',
    coreSignalApiKey: import.meta.env.VITE_CORESIGNAL_API_KEY || '',
    brightDataApiKey: import.meta.env.VITE_BRIGHTDATA_API_KEY || '',
    jobsQueueUrl: import.meta.env.VITE_JOBS_QUEUE_URL || '',
    geoLocationQueueUrl: import.meta.env.VITE_GEOLOCATION_QUEUE_URL || '',
    sourceWebsiteCompaniesQueueUrl: import.meta.env.VITE_SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    glassdoorCompaniesQueueUrl: import.meta.env.VITE_GLASSDOOR_COMPANIES_QUEUE_URL || '',
    glassdoorReviewsQueueUrl: import.meta.env.VITE_GLASSDOOR_REVIEWS_QUEUE_URL || '',
    crunchbaseCompaniesQueueUrl: import.meta.env.VITE_CRUNCHBASE_COMPANIES_QUEUE_URL || '',
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
  staggerQueueUrl,
} = env;
