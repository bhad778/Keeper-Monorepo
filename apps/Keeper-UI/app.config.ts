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
    apiUrl: process.env.API_URL as string,
    affindaKey: process.env.AFFINDA_KEY as string,
    affindaWorkspaceId: process.env.AFFINDA_WORKSPACE_ID as string,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
    pubNubPublishKey: process.env.PUBNUB_PUBLISH_KEY as string,
    pubNubSubscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY as string,
    brandFetchApiKey: process.env.BRANDFETCH_API_KEY as string,
  },
});
