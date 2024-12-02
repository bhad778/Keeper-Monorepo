import { TGrowthEngineEntry, TImagePayload, TPubnubNotificationMessageObject } from 'types/globalTypes';
import axios from 'axios';
import { TCoreSignalSearchFilters } from 'types/employeeTypes';

const apiUrl = import.meta.env.VITE_API_URL;

const MiscService = {
  imageUpload: (payload: TImagePayload) => {
    return axios
      .post(`${apiUrl}/imageUpload`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  // this gets just enough data for autocomplete
  // searchBrandFetch: (payload: { searchValue: string }) => {
  //   return axios
  //     .post(`${apiUrl}/searchBrandFetch`, payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((response) => response.data);
  // },
  searchBrandFetch: (payload: { searchValue: string }) => {
    return axios
      .get(`https://api.brandfetch.io/v2/search/${payload.searchValue}`, {
        headers: {
          accept: 'application/json',
        },
      })
      .then((response) => response.data);
  },
  // this gets detailed data
  // collectBrandFetch: (payload: { companyName: string }) => {
  //   return axios
  //     .post(`${apiUrl}/collectBrandFetch`, payload, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((response) => response.data);
  // },
  collectBrandFetch: (payload: { companyName: string }) => {
    return axios
      .get(`https://api.brandfetch.io/v2/brands/${payload.companyName}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer oj9mRe/OqBVTP13f0O9fwu0D7xzZXGxKs5IDoml7w6c=`,
        },
      })
      .then((response) => response.data);
  },
  searchAndCollectCoreSignal: (filters: TCoreSignalSearchFilters & { isPing?: boolean }) => {
    return axios
      .post(`${apiUrl}/searchAndCollectCoreSignal`, filters, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  getGoogleMapsLocations: (payload: { locationText: string; isPing?: boolean }) => {
    return axios
      .post(`${apiUrl}/getGoogleMapsLocations`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  sendPubnubNotification: (payload: { messageObject: TPubnubNotificationMessageObject }) => {
    return axios
      .post(`${apiUrl}/sendPubnubNotification`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  getGrowthEngineEntries: () => {
    return axios
      .post(`${apiUrl}/getGrowthEngineEntries`, '', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
  addGrowthEngineEntry: (growthEngineEntry: TGrowthEngineEntry) => {
    return axios
      .post(`${apiUrl}/addGrowthEngineEntry`, growthEngineEntry, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => response.data);
  },
};

export default MiscService;
