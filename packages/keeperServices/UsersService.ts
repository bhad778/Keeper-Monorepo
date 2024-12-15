import axios from 'axios';
import { TAccountType, TMatch, TSwipe, TEmployeeSettings } from 'keeperTypes';
import { apiUrl } from 'keeperEnvironment';

// make this use user service and make updateUserSettings always have loggedInUser id and account type

const UsersService = {
  updateUserSettings: (payload: {
    userId: string;
    accountType: string;
    newSettings: Partial<TEmployeeSettings>;
    lastUpdatedOnWeb: boolean;
    isIncomplete?: boolean;
  }) => {
    return axios
      .post(`${apiUrl}/updateUserSettings`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  recordSwipe: (payload: TSwipe) => {
    return axios
      .post(`${apiUrl}/recordSwipe`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getUsersByArrayOfIds: (payload: { userIdsArray: string[]; isEmployee: boolean }) => {
    return axios
      .post(`${apiUrl}/getUsersByArrayOfIds`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  addMatch: (payload: { accountType: TAccountType; loggedInUserMatch: TMatch; otherUserMatch: TMatch }) => {
    return axios
      .post(`${apiUrl}/addMatch`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateUserData: (payload: { userId: string; accountType: TAccountType; updateObject: any }) => {
    return axios
      .post(`${apiUrl}/updateUserData`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateMatchNotification: (payload: {
    userId: string;
    accountType: TAccountType;
    matchId: string;
    hasNotification: boolean;
  }) => {
    return axios
      .post(`${apiUrl}/updateMatchNotification`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateMatchForBothOwners: (payload: {
    userId: string;
    accountType: TAccountType;
    matchToUpdate: Partial<TMatch>;
  }) => {
    return axios
      .post(`${apiUrl}/updateMatchForBothOwners`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateOwnMatch: (payload: { userId: string; accountType: TAccountType; matchToUpdate: Partial<TMatch> }) => {
    return axios
      .post(`${apiUrl}/updateOwnMatch`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  deleteMatch: (payload: { userId: string; accountType: TAccountType; matchToDeleteId: string }) => {
    return axios
      .post(`${apiUrl}/deleteMatch`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getMatches: (payload: any) => {
    return axios
      .post(`${apiUrl}/getMatches`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getEmployeeData: (payload: any) => {
    return axios
      .post(`${apiUrl}/getEmployeeData`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getEmployerData: (payload: any) => {
    return axios
      .post(`${apiUrl}/getEmployerData`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  onSelectJob: (payload: any) => {
    return axios
      .post(`${apiUrl}/onSelectJob`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  recordEmployeesSwipes: (payload: any) => {
    return axios
      .post(`${apiUrl}/recordEmployeesSwipes`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getEmployee: (payload: { userId: string }) => {
    return axios
      .post(`${apiUrl}/getEmployee`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  getEmployeesForSwiping: (payload?: any) => {
    return axios
      .post(`${apiUrl}/getEmployeesForSwiping`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateEmployeePreferences: (payload?: any) => {
    return axios
      .post(`${apiUrl}/updateEmployeePreferences`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
  updateExpoPushToken: (payload: { accountType: string; expoPushToken: string; id: string }) => {
    return axios
      .post(`${apiUrl}/updateExpoPushToken`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.data);
  },
};

export default UsersService;
