import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Keeper',
  slug: 'keeper',
  scheme: 'keeper',
  updates: {
    url: 'https://u.expo.dev/39e925b0-7f22-4951-81bc-5321092da990',
  },
  runtimeVersion: {
    policy: 'sdkVersion',
  },
  hooks: {
    postPublish: [
      {
        file: 'sentry-expo/upload-sourcemaps',
        config: {
          organization: 'keeper-ae',
          project: 'keeper',
        },
      },
    ],
  },
  plugins: [
    'sentry-expo',
    'expo-font',
    'expo-secure-store',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
        },
        ios: {
          deploymentTarget: '13.4',
        },
      },
    ],
    [
      'expo-document-picker',
      {
        appleTeamId: 'NLC95FQJL3',
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission: `This app asks for photos permission to allow users to upload photos to their profile if they would like to, so other users may see the photos on your profile.
         Example- A recruiter will make a job and they can upload a photo of that company so that other users will see it on the job description.`,
        cameraPermission: `This app asks for camera permission to allow users to take a picture to upload. to their profile if 
        they would like to, so other users may see the photos on your profile. Example- A recruiter will make a job and they can upload a photo of that company so that other users will see it on the job description.`,
      },
    ],
  ],
  extra: {
    eas: {
      projectId: '39e925b0-7f22-4951-81bc-5321092da990',
    },
    apiUrl: process.env.API_URL || 'https://mzl4y00fba.execute-api.us-east-1.amazonaws.com/dev',
    affindaKey: process.env.AFFINDA_KEY || 'aff_e3c2ea8157f4a53a150f68d13e17cebaf8326fab',
    affindaWorkspaceId: process.env.AFFINDA_WORKSPACE_ID || 'ViTkWMXy',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyB0GiWadL-4lSXe7PNO9Vr47iTC4t7C94I',
    pubNubPublishKey: process.env.PUBNUB_PUBLISH_KEY || 'pub-c-ee82e65c-ea92-4e43-b55a-2029d743137b',
    pubNubSubscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY || 'sub-c-5bbfeb92-6aaa-4596-bc4a-55f3faad900a',
    brandFetchApiKey: process.env.BRANDFETCH_API_KEY || 'oj9mRe/OqBVTP13f0O9fwu0D7xzZXGxKs5IDoml7w6c=',
  },
});
