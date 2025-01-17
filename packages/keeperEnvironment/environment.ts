let env: Record<string, string> = {};

// Check the runtime environment
const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;
const isReactNative = !isNode && typeof navigator !== 'undefined';

if (isReactNative) {
  // Dynamically import expo-constants to avoid backend issues
  const Constants = require('expo-constants').default;
  env = Constants.expoConfig?.extra || {};
} else if (isNode) {
  // Node.js: Use dotenv to load environment variables
  const dotenv = require('dotenv');
  const path = require('path');

  // Load environment-specific .env file
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
  dotenv.config({ path: path.resolve(__dirname, `../../${envFile}`) });

  env = {
    API_URL: process.env.API_URL || '',
    AFFINDA_KEY: process.env.AFFINDA_KEY || '',
    AFFINDA_WORKSPACE_ID: process.env.AFFINDA_WORKSPACE_ID || '',
    GOOGLE_MAPS_ROOT_URL:
      process.env.GOOGLE_MAPS_ROOT_URL || 'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    PUBNUB_PUBLISH_KEY: process.env.PUBNUB_PUBLISH_KEY || '',
    PUBNUB_SUBSCRIBE_KEY: process.env.PUBNUB_SUBSCRIBE_KEY || '',
    BRANDFETCH_API_KEY: process.env.BRANDFETCH_API_KEY || '',
    DB: process.env.DB || '',
    CORESIGNAL_API_KEY: process.env.CORESIGNAL_API_KEY || '',
    BRIGHTDATA_API_KEY: process.env.BRIGHTDATA_API_KEY || '',
    JOBS_QUEUE_URL: process.env.JOBS_QUEUE_URL || '',
    GEOLOCATION_QUEUE_URL: process.env.GEOLOCATION_QUEUE_URL || '',
    SOURCE_WEBSITE_COMPANIES_QUEUE_URL: process.env.SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_COMPANIES_QUEUE_URL: process.env.GLASSDOOR_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_REVIEWS_QUEUE_URL: process.env.GLASSDOOR_REVIEWS_QUEUE_URL || '',
    CRUNCHBASE_COMPANIES_QUEUE_URL: process.env.CRUNCHBASE_COMPANIES_QUEUE_URL || '',
  };
} else {
  // React (Web): Use process.env directly
  env = {
    API_URL: process.env.REACT_APP_API_URL || '',
    AFFINDA_KEY: process.env.REACT_APP_AFFINDA_KEY || '',
    AFFINDA_WORKSPACE_ID: process.env.REACT_APP_AFFINDA_WORKSPACE_ID || '',
    GOOGLE_MAPS_ROOT_URL:
      process.env.REACT_APP_GOOGLE_MAPS_ROOT_URL ||
      'https://maps.googleapis.com/maps/api/place/autocomplete/json?types=geocode',
    GOOGLE_MAPS_API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
    PUBNUB_PUBLISH_KEY: process.env.REACT_APP_PUBNUB_PUBLISH_KEY || '',
    PUBNUB_SUBSCRIBE_KEY: process.env.REACT_APP_PUBNUB_SUBSCRIBE_KEY || '',
    BRANDFETCH_API_KEY: process.env.REACT_APP_BRANDFETCH_API_KEY || '',
    DB: process.env.REACT_APP_DB || '',
    CORESIGNAL_API_KEY: process.env.REACT_APP_CORESIGNAL_API_KEY || '',
    BRIGHTDATA_API_KEY: process.env.REACT_APP_BRIGHTDATA_API_KEY || '',
    JOBS_QUEUE_URL: process.env.REACT_APP_JOBS_QUEUE_URL || '',
    GEOLOCATION_QUEUE_URL: process.env.REACT_APP_GEOLOCATION_QUEUE_URL || '',
    SOURCE_WEBSITE_COMPANIES_QUEUE_URL: process.env.REACT_APP_SOURCE_WEBSITE_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_COMPANIES_QUEUE_URL: process.env.REACT_APP_GLASSDOOR_COMPANIES_QUEUE_URL || '',
    GLASSDOOR_REVIEWS_QUEUE_URL: process.env.REACT_APP_GLASSDOOR_REVIEWS_QUEUE_URL || '',
    CRUNCHBASE_COMPANIES_QUEUE_URL: process.env.REACT_APP_CRUNCHBASE_COMPANIES_QUEUE_URL || '',
  };
}

export default env;
