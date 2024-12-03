import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { TJob, TJobSettings, TMatch, TEmployeeSettings, TLoggedInUserData } from 'keeperTypes';
import { TJobPreferences } from 'types/employerTypes';
import { TEmployeePreferences } from 'types/employeeTypes';
import { filterArrayOfObjectsByKey } from 'utils';

// isNew is in preferences for employees and is on the root for employers, this is because there was
// a case in the past where it had to be this way, but not anymore and is now tech debt. They should
// be the same variable for both log in types
const initialState: TLoggedInUserData = {
  _id: '',
  isAdmin: false,
  phoneNumber: '',
  accountType: '',
  matches: [],
  employersJobs: [],
  firstName: '',
  lastName: '',
  email: '',
  expoPushToken: null,
  hasSeenFirstLikeAlert: false,
  hasGottenToEditProfileScreen: false,
  hasReceivedLikeNotification: false,
  receivedLikes: [],
  relevantSkills: [],
  isLoggedIn: false,
  createdAt: new Date(),
  education: 1,
  geoLocation: {
    type: '',
    coordinates: [0, 0],
  },
  isNew: true,
  settings: {
    img: '',
    address: '',
    lastName: '',
    firstName: '',
    yearsOfExperience: 0,
    aboutMeText: '',
    jobTitle: '',
    isSeekingFirstJob: false,
    isUsCitizen: true,
    onSiteOptionsOpenTo: [],
    searchRadius: 50,
    jobHistory: [],
    educationHistory: [],
  },
  preferences: {
    address: '',
    searchRadius: 0,
    requiredYearsOfExperience: 0,
    requiredEducation: 0,
    geoLocation: {
      type: '',
      coordinates: [0, 0],
    },
    isRemote: true,
    isNew: true,
    relevantSkills: [''],
  },
};

export const loggedInUserSlice = createSlice({
  name: 'loggedInUser',
  initialState,
  reducers: {
    resetLoggedInUserSlice: () => initialState,
    addLoggedInUser: (state, action: PayloadAction<Partial<TLoggedInUserData>>) => {
      return { ...state, ...action.payload };
    },
    updateLoggedInUserImgRedux: (state, action: PayloadAction<string>) => {
      state.settings.img = action.payload;
    },
    setLoggedInUser: (state, action: PayloadAction<TLoggedInUserData>) => {
      return action.payload;
    },
    addMatches: (state, action: PayloadAction<{ newMatches: TMatch[]; jobId?: string }>) => {
      const { newMatches, jobId } = action.payload;

      if (state.accountType === 'employee') {
        state.matches = [...state.matches, ...newMatches];
      } else {
        const currentEmployersJobs = state.employersJobs ? [...state.employersJobs] : [];

        const foundIndex = currentEmployersJobs?.findIndex(x => x?._id === jobId);
        if (foundIndex != -1) {
          let noDuplicatesMergedMatches = [...currentEmployersJobs[foundIndex].matches, ...newMatches];

          noDuplicatesMergedMatches = filterArrayOfObjectsByKey(noDuplicatesMergedMatches, 'id');

          currentEmployersJobs[foundIndex].matches = noDuplicatesMergedMatches;
        }

        state.employersJobs = currentEmployersJobs;
      }
    },
    setMatches: (state, action: PayloadAction<{ newMatches: TMatch[]; jobId?: string }>) => {
      const { newMatches, jobId } = action.payload;

      if (state.accountType === 'employee') {
        state.matches = newMatches;
      } else {
        const currentEmployersJobs = [...state.employersJobs];

        const foundIndex = currentEmployersJobs?.findIndex(x => x?._id === jobId);
        if (foundIndex != -1) {
          currentEmployersJobs[foundIndex].matches = newMatches;
        }

        state.employersJobs = currentEmployersJobs;
      }
    },
    deleteJobRedux: (state, action: PayloadAction<{ jobId: string }>) => {
      const { jobId } = action.payload;

      state.employersJobs = state.employersJobs?.filter(item => item._id !== jobId);
    },
    updateMatchNotificationRedux: (state, action: PayloadAction<{ matchId: string; hasNotification: boolean }>) => {
      const { matchId, hasNotification } = action.payload;

      if (state.accountType === 'employee') {
        const currentMatches = [...state.matches];
        const foundIndex = currentMatches?.findIndex(x => x?.id === matchId);
        if (foundIndex >= 0 && currentMatches[foundIndex] && currentMatches[foundIndex].custom) {
          currentMatches[foundIndex].custom.hasNotification = hasNotification;
          currentMatches[foundIndex].custom.isNew = false;
          state.matches = currentMatches;
        }
      } else {
        const currentJobs = state.employersJobs ? [...state.employersJobs] : [];

        let jobIndex: null | number = null;
        let matchIndex: null | number = null;

        // get index of job and match within that job in currentJobs that this match belongs too
        currentJobs.forEach((job: TJob, currentJobsIndex: number) => {
          job.matches.forEach((match: TMatch, currentMatchIndex: number) => {
            if (match.id === matchId) {
              jobIndex = currentJobsIndex;
              matchIndex = currentMatchIndex;
            }
          });
        });

        // update match in currentJobs with new hasNotification value
        if (
          jobIndex != null &&
          matchIndex != null &&
          matchIndex > -1 &&
          jobIndex > -1 &&
          currentJobs[jobIndex] &&
          currentJobs[jobIndex].matches[matchIndex].custom
        ) {
          currentJobs[jobIndex].matches[matchIndex].custom.hasNotification = hasNotification;
          currentJobs[jobIndex].matches[matchIndex].custom.isNew = false;
        }

        state.employersJobs = currentJobs;
      }
    },
    updateMatch: (state, action: PayloadAction<{ matchData: Partial<TMatch> }>) => {
      const { matchData } = action.payload;

      if (state.accountType === 'employee') {
        const currentMatches = [...state.matches];
        const foundIndex = state.matches?.findIndex(x => x?.id === matchData?.id);
        const tempMatchToUpdate = {
          ...matchData,
          custom: {
            ...currentMatches[foundIndex].custom,
            ...matchData.custom,
          },
        };
        if (foundIndex != -1) {
          currentMatches[foundIndex] = { ...currentMatches[foundIndex], ...tempMatchToUpdate };
        }
        state.matches = currentMatches;
      } else {
        const currentJobs = state.employersJobs ? [...state.employersJobs] : [];

        let jobIndex: null | number = null;
        let matchIndex: null | number = null;

        // get index of job and match within that job in currentJobs that this match belongs too
        currentJobs.forEach((job: TJob, currentJobsIndex: number) => {
          job.matches.forEach((match: TMatch, currentMatchIndex: number) => {
            if (match.id === matchData?.id) {
              jobIndex = currentJobsIndex;
              matchIndex = currentMatchIndex;
            }
          });
        });

        if (jobIndex != null && matchIndex != null && matchIndex > -1 && jobIndex > -1) {
          currentJobs[jobIndex].matches[matchIndex] = { ...currentJobs[jobIndex].matches[matchIndex], ...matchData };
          state.employersJobs = currentJobs;
        }
      }
    },
    setEmployersJobs: (state, action: PayloadAction<any>) => {
      state.employersJobs = action.payload;
    },
    addEmployersJobs: (state, action: PayloadAction<TJob>) => {
      state.employersJobs = [...state.employersJobs, action.payload];
    },
    addReceivedLike: (state, action: PayloadAction<{ receivedLikeId: string; jobId: string }>) => {
      const { receivedLikeId, jobId } = action.payload;
      if (jobId && state.employersJobs) {
        const tempEmployersJobs = [...state.employersJobs];

        const index = tempEmployersJobs.findIndex(job => job._id === jobId);

        tempEmployersJobs[index].receivedLikes = [receivedLikeId, ...state.receivedLikes];

        state.employersJobs = tempEmployersJobs;
      } else {
        state.receivedLikes = [receivedLikeId, ...state.receivedLikes];
      }
      state.hasReceivedLikeNotification = true;
    },
    removeFromReceivedLikesById: (
      state,
      action: PayloadAction<{ idToRemove: string; jobIdToRemoveReceivedLikeFrom: string }>,
    ) => {
      const { idToRemove, jobIdToRemoveReceivedLikeFrom } = action.payload;
      if (jobIdToRemoveReceivedLikeFrom && state.employersJobs) {
        const tempEmployersJobs = [...state.employersJobs];

        const index = tempEmployersJobs.findIndex(job => job._id === jobIdToRemoveReceivedLikeFrom);

        let tempReceivedLikes = [...tempEmployersJobs[index].receivedLikes];

        tempReceivedLikes = tempReceivedLikes.filter(id => id !== idToRemove);

        tempEmployersJobs[index].receivedLikes = tempReceivedLikes;

        state.employersJobs = tempEmployersJobs;
      } else {
        let tempReceivedLikes = [...state.receivedLikes];

        tempReceivedLikes = tempReceivedLikes.filter(id => id !== idToRemove);

        state.receivedLikes = tempReceivedLikes;
      }
    },
    updateEmployersJob: (state, action: PayloadAction<{ jobId: string; updateJobObject: Partial<TJob> }>) => {
      const { jobId, updateJobObject } = action.payload;
      const currentEmployersJobs = [...state.employersJobs];

      const foundIndex = currentEmployersJobs?.findIndex(x => x._id === jobId);
      currentEmployersJobs[foundIndex] = {
        ...currentEmployersJobs[foundIndex],
        ...updateJobObject,
      };

      state.employersJobs = currentEmployersJobs;
    },
    setEmployeePreferencesRedux: (state, action: PayloadAction<TEmployeePreferences>) => {
      state.preferences = action.payload;
    },
    updateEmployerJobSettingsRedux: (
      state,
      action: PayloadAction<{ userId: string; newSettings: Partial<TJobSettings> }>,
    ) => {
      const { userId, newSettings } = action.payload;
      const currentEmployersJobs = [...state.employersJobs];

      const foundIndex = currentEmployersJobs?.findIndex(x => x._id === userId);
      currentEmployersJobs[foundIndex].settings = {
        ...currentEmployersJobs[foundIndex].settings,
        ...newSettings,
      };

      state.employersJobs = currentEmployersJobs;
    },
    setEmployerJobPreferencesRedux: (
      state,
      action: PayloadAction<{ jobId: string; updateJobPreferencesObject: TJobPreferences }>,
    ) => {
      const { jobId, updateJobPreferencesObject } = action.payload;
      const currentEmployersJobs = [...state.employersJobs];

      const foundIndex = currentEmployersJobs?.findIndex(x => x?._id === jobId);
      currentEmployersJobs[foundIndex].preferences = {
        ...currentEmployersJobs[foundIndex].preferences,
        ...updateJobPreferencesObject,
      };

      state.employersJobs = currentEmployersJobs;
    },
    updateResumeData: (state, action: PayloadAction<Partial<TEmployeeSettings>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
});

export const {
  resetLoggedInUserSlice,
  addLoggedInUser,
  setLoggedInUser,
  setMatches,
  addMatches,
  updateMatch,
  setEmployersJobs,
  addEmployersJobs,
  updateLoggedInUserImgRedux,
  setEmployeePreferencesRedux,
  updateResumeData,
  updateEmployerJobSettingsRedux,
  setEmployerJobPreferencesRedux,
  updateMatchNotificationRedux,
  deleteJobRedux,
  updateEmployersJob,
  removeFromReceivedLikesById,
  addReceivedLike,
} = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;
