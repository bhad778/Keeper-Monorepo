import {
  TCoreSignalSearchFilters,
  TGrowthEngineEntry,
  TImagePayload,
  TPubnubNotificationMessageObject,
} from 'keeperTypes';
import { getRequest, postRequest } from './serviceUtils';

const MiscService = {
  imageUpload: (payload: TImagePayload) => postRequest('imageUpload', payload),

  // BrandFetch API calls
  searchBrandFetch: (payload: { searchValue: string }) =>
    getRequest(`https://api.brandfetch.io/v2/search/${payload.searchValue}`, {
      accept: 'application/json',
    }),
  collectBrandFetch: (payload: { companyName: string }) =>
    getRequest(`https://api.brandfetch.io/v2/brands/${payload.companyName}`, {
      accept: 'application/json',
      Authorization: `Bearer oj9mRe/OqBVTP13f0O9fwu0D7xzZXGxKs5IDoml7w6c=`,
    }),

  // CoreSignal
  searchAndCollectCoreSignal: (filters: TCoreSignalSearchFilters & { isPing?: boolean }) =>
    postRequest('searchAndCollectCoreSignal', filters),

  // Google Maps
  getGoogleMapsLocations: (payload: { locationText: string; isPing?: boolean }) =>
    postRequest('getGoogleMapsLocations', payload),

  // PubNub
  sendPubnubNotification: (payload: { messageObject: TPubnubNotificationMessageObject }) =>
    postRequest('sendPubnubNotification', payload),

  // Growth Engine
  getGrowthEngineEntries: () => postRequest('getGrowthEngineEntries'),
  addGrowthEngineEntry: (growthEngineEntry: TGrowthEngineEntry) =>
    postRequest('addGrowthEngineEntry', growthEngineEntry),
};

export default MiscService;
