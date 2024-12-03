import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import { TJobSettings, TMatch, TJobPreferences, TJob } from 'keeperTypes';

import { TLocalData } from './localSliceTypes';
import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';

const blankSelectedJob: TJob = {
  _id: '',
  ownerEmail: '',
  ownerId: '',
  geoLocation: {
    type: 'hey',
    coordinates: [1, 2],
  },
  publicTakers: [],
  matches: [],
  receivedLikes: [],
  createdAt: new Date(),
  lastUpdatedOnWeb: false,
  color: '',
  expoPushToken: '',
  publicJobTakenCount: 0,
  settings: {
    title: '',
    companyName: 'Mana Corp',
    companyDescription: 'Front end development in react native app',
    jobOverview: 'Longer job overview text',
    address: 'Roswell, GA',
    isPublic: true,
    compensation: {
      type: 'Salary',
      payRange: {
        min: 50000,
        max: 80000,
      },
    },
    relevantSkills: [],
    requiredYearsOfExperience: 3,
    jobRequirements: [],
    onSiteSchedule: 'Remote',
    img: '',
    benefits: [],
    referralBonus: 0,
  },
  preferences: {
    searchRadius: 9000,
    yearsOfExperience: 2,
    isRemote: true,
    geoLocation: {
      type: '',
      coordinates: [1, 2],
    },
    relevantSkills: [],
    frontendBackendOptionsOpenTo: [],
    companySizeOptionsOpenTo: [],
  },
};

const initialState: TLocalData = {
  bottomNavBarHeight: bottomTabNavigatorBaseHeight,
  selectedJob: blankSelectedJob,
  isGetDataForSwipingLoading: false,
};

export const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    resetLocalSlice: () => initialState,
    addLocalData: (state, action: PayloadAction<Partial<TLocalData>>) => {
      return { ...state, ...action.payload };
    },
    addSelectedJobMatchesRedux: (state, action: PayloadAction<TMatch[]>) => {
      state.selectedJob.matches = [...state.selectedJob.matches, ...action.payload];
    },
    updateSelectedJobMatch: (state, action: PayloadAction<{ matchData: Partial<TMatch> }>) => {
      const { matchData } = action.payload;
      const currentMatches = [...state.selectedJob.matches];
      const foundIndex = state.selectedJob.matches.findIndex(x => x.id === matchData.id);
      currentMatches[foundIndex] = { ...currentMatches[foundIndex], ...matchData };
      state.selectedJob.matches = currentMatches;
    },
    updateSelectedJobMatchNotificationRedux: (
      state,
      action: PayloadAction<{ matchId: string; hasNotification: boolean }>,
    ) => {
      const { matchId, hasNotification } = action.payload;

      const currentMatches = [...state.selectedJob.matches];
      const foundIndex = state.selectedJob.matches.findIndex(x => x.id === matchId);
      if (
        foundIndex >= 0 &&
        currentMatches[foundIndex] &&
        currentMatches[foundIndex].custom &&
        currentMatches[foundIndex].custom.hasNotification
      ) {
        currentMatches[foundIndex].custom.hasNotification = hasNotification;
        state.selectedJob.matches = currentMatches;
      }
    },
    unselectJobRedux: state => {
      state.selectedJob = blankSelectedJob;
    },
    setSelectedJob: (state, action: PayloadAction<any>) => {
      state.selectedJob = action.payload;
    },
    setIsGetDataForSwipingLoading: (state, action: PayloadAction<boolean>) => {
      state.isGetDataForSwipingLoading = action.payload;
    },
    updateSelectedJob: (state, action: PayloadAction<Partial<TJob>>) => {
      state.selectedJob = { ...state.selectedJob, ...action.payload };
    },
    setBottomNavBarHeight: (state, action: PayloadAction<any>) => {
      state.bottomNavBarHeight = action.payload;
    },
    updateSelectedJobSettingsRedux: (state, action: PayloadAction<Partial<TJobSettings>>) => {
      state.selectedJob.settings = { ...state.selectedJob.settings, ...action.payload };
    },
    setSelectedJobPreferencesRedux: (state, action: PayloadAction<TJobPreferences>) => {
      state.selectedJob.preferences = { ...state.selectedJob.preferences, ...action.payload };
    },
  },
});

export const {
  resetLocalSlice,
  addLocalData,
  setSelectedJob,
  updateSelectedJob,
  setBottomNavBarHeight,
  updateSelectedJobSettingsRedux,
  setSelectedJobPreferencesRedux,
  addSelectedJobMatchesRedux,
  updateSelectedJobMatch,
  updateSelectedJobMatchNotificationRedux,
  unselectJobRedux,
  setIsGetDataForSwipingLoading,
} = localSlice.actions;

export default localSlice.reducer;
