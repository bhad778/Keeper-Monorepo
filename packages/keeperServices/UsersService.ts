import { TAccountType, TMatch, TSwipe, TEmployeeSettings } from 'keeperTypes';
import { postRequest } from './serviceUtils';

// make this use user service and make updateUserSettings always have loggedInUser id and account type

const UsersService = {
  updateUserSettings: ({
    userId,
    accountType,
    newSettings,
    lastUpdatedOnWeb,
    isIncomplete,
  }: {
    userId: string;
    accountType: string;
    newSettings: Partial<TEmployeeSettings>;
    lastUpdatedOnWeb: boolean;
    isIncomplete?: boolean;
    isPing?: boolean;
  }) => postRequest('updateUserSettings', { userId, accountType, newSettings, lastUpdatedOnWeb, isIncomplete }),

  recordSwipe: (payload: TSwipe) => postRequest('recordSwipe', payload),

  getUsersByArrayOfIds: (payload: { userIdsArray: string[]; isEmployee: boolean }) =>
    postRequest('getUsersByArrayOfIds', payload),

  addMatch: (payload: { accountType: TAccountType; loggedInUserMatch: TMatch; otherUserMatch: TMatch }) =>
    postRequest('addMatch', payload),

  updateUserData: (payload: { userId: string; accountType: TAccountType; updateObject: any }) =>
    postRequest('updateUserData', payload),

  updateMatchNotification: (payload: {
    userId: string;
    accountType: TAccountType;
    matchId: string;
    hasNotification: boolean;
  }) => postRequest('updateMatchNotification', payload),

  updateMatchForBothOwners: (payload: { userId: string; accountType: TAccountType; matchToUpdate: Partial<TMatch> }) =>
    postRequest('updateMatchForBothOwners', payload),

  updateOwnMatch: (payload: { userId: string; accountType: TAccountType; matchToUpdate: Partial<TMatch> }) =>
    postRequest('updateOwnMatch', payload),

  deleteMatch: (payload: { userId: string; accountType: TAccountType; matchToDeleteId: string }) =>
    postRequest('deleteMatch', payload),

  getMatches: (payload: any) => postRequest('getMatches', payload),

  getEmployeeData: (payload: any) => postRequest('getEmployeeData', payload),

  getEmployerData: (payload: any) => postRequest('getEmployerData', payload),

  onSelectJob: (payload: any) => postRequest('onSelectJob', payload),

  recordEmployeesSwipes: (payload: any) => postRequest('recordEmployeesSwipes', payload),

  getEmployee: (payload: { userId: string }) => postRequest('getEmployee', payload),

  getEmployeesForSwiping: (payload?: any) => postRequest('getEmployeesForSwiping', payload),

  updateEmployeePreferences: (payload?: any) => postRequest('updateEmployeePreferences', payload),

  updateExpoPushToken: (payload: { accountType: string; expoPushToken: string; id: string }) =>
    postRequest('updateExpoPushToken', payload),
};

export default UsersService;
