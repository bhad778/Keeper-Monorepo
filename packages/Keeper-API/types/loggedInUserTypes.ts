import { TEmployeePreferences, TEmployeeSettings } from './employeeTypes';
import { TJob } from './employerTypes';

export type TLoggedInUserData = TLoggedInEmployee & TLoggedInEmployer;

export type TLoggedInEmployee = {
  _id: string;
  phoneNumber: string;
  accountType: string;
  receivedLikes: string[];
  expoPushToken: string;
  hasSeenFirstLikeAlert: boolean;
  hasGottenToEditProfileScreen: boolean;
  hasReceivedLikeNotification: boolean;
  settings: TEmployeeSettings;
  matches: Array<Partial<TJob>>;
  preferences: TEmployeePreferences;
};

export type TLoggedInEmployer = {
  _id: string;
  phoneNumber: string;
  accountType: string;
  employersJobs: [];
};
