import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, View, TouchableOpacity } from 'react-native';
import {
  AppBoldText,
  AppHeaderText,
  BottomSheet,
  BottomSheetFilterContent,
  Chip,
  KeeperSelectDropdown,
} from 'components';
import {
  RootState,
  setEmployeePreferencesRedux,
  setIsGetDataForSwipingLoading,
  setSelectedJobPreferencesRedux,
  setSwipingDataRedux,
} from 'reduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { useEmployer } from 'hooks';
import {
  EmploymentTypes,
  TCompanySize,
  TEmployeePreferences,
  TFrontendBackendOptions,
  TJob,
  TJobPreferences,
} from 'keeperTypes';
import { filterList } from 'constants/globalConstants';
import { JobsService, UsersService } from 'services';
import { TWorkAuthOptions } from 'types/globalTypes';
import { useNavigation } from '@react-navigation/native';
import { AlertModal } from 'modals';
import { SafeAreaView } from 'react-native-safe-area-context';

import useStyles from './EmployerDiscoverHeaderStyles';

type LocalStateObject = {
  localYearsOfExperience: number;
  localSkills: string[];
  localFrontendBackendSelections?: TFrontendBackendOptions[];
  localCompanySizeSelections?: TCompanySize[];
  localEmploymentTypeSelections?: EmploymentTypes[];
  localWorkAuthSelections?: TWorkAuthOptions[];
};

type EmployerDiscoverHeaderProps = {
  isNew?: boolean;
};

const EmployerDiscoverHeader = ({ isNew }: EmployerDiscoverHeaderProps) => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);
  const selectedJobTitle = useSelector((state: RootState) => state.local.selectedJob.settings.title);
  const selectedJobCompanyName = useSelector((state: RootState) => state.local.selectedJob.settings.companyName);
  const selectedJobColor = useSelector((state: RootState) => state.local.selectedJob.color);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const selectedJobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  const [selectedFilter, setSelectedFilter] = useState('');
  const [isBrowsingLikeAlertOpen, setIsBrowsingLikeAlertOpen] = useState(false);

  const { setSelectedJob } = useEmployer();
  const styles = useStyles(isNew, selectedJobColor);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isEmployee = accountType === 'employee';

  // we reverse jobs because we reverse job on job board, because we want
  // the oldest jobs to be last and new ones to go to the top
  const returnReversedJobs = () => {
    const tempEmployersJobs = employersJobs ? [...employersJobs] : [];
    return tempEmployersJobs.reverse();
  };

  const removeSelectedJobFromDropdownData = () => {
    if (employersJobs) {
      return employersJobs.filter(obj => obj._id !== selectedJobId);
    } else {
      return [];
    }
  };

  const onNewJobSelect = useCallback(
    (selectedJob: TJob) => {
      setSelectedJob(selectedJob);
    },
    [setSelectedJob],
  );

  useEffect(() => {
    const reversedJobs = returnReversedJobs();
    const firstJobInStack = employersJobs ? reversedJobs[0] : undefined;
    if (!selectedJobId) {
      if (firstJobInStack) {
        setSelectedJob(firstJobInStack);
      }
    }
  }, [employersJobs, selectedJobId]);

  const closeBottomSheet = useCallback(() => {
    setSelectedFilter('');
  }, []);

  const onPressFilterChip = (filterName: string) => {
    if (employersJobs && employersJobs?.length > 0) {
      setSelectedFilter(filterName);
    } else {
      setIsBrowsingLikeAlertOpen(true);
    }
  };

  const returnEmployeePreferencesObject = useCallback(
    (localStateObject: LocalStateObject) => {
      const employeePreferencesTemp: TEmployeePreferences = {
        searchRadius: employeePreferences.searchRadius,
        requiredYearsOfExperience: localStateObject.localYearsOfExperience,
        geoLocation: employeePreferences.geoLocation,
        relevantSkills: localStateObject.localSkills,
        isRemote: employeePreferences.isRemote,
        isNew: employeePreferences.isNew,
      };

      return employeePreferencesTemp;
    },
    [
      employeePreferences.geoLocation,
      employeePreferences.isNew,
      employeePreferences.isRemote,
      employeePreferences.searchRadius,
    ],
  );

  const returnSelectedJobPreferencesObject = useCallback(
    (localStateObject: LocalStateObject) => {
      const selectedJobPreferencesTemp: TJobPreferences = {
        geoLocation: selectedJobPreferences.geoLocation,
        searchRadius: selectedJobPreferences.searchRadius,
        yearsOfExperience: localStateObject.localYearsOfExperience,
        relevantSkills: localStateObject.localSkills,
        isRemote: selectedJobPreferences.isRemote,
        frontendBackendOptionsOpenTo: localStateObject.localFrontendBackendSelections,
        companySizeOptionsOpenTo: localStateObject.localCompanySizeSelections,
        employmentTypeOptionsOpenTo: localStateObject.localEmploymentTypeSelections,
        workAuthOptionsOpenTo: localStateObject.localWorkAuthSelections,
      };

      return selectedJobPreferencesTemp;
    },
    [selectedJobPreferences.geoLocation, selectedJobPreferences.isRemote, selectedJobPreferences.searchRadius],
  );

  const saveLocalValuesInRedux = useCallback(
    (localStateObject: LocalStateObject) => {
      if (isEmployee) {
        dispatch(setEmployeePreferencesRedux(returnEmployeePreferencesObject(localStateObject)));
      } else {
        dispatch(setSelectedJobPreferencesRedux(returnSelectedJobPreferencesObject(localStateObject)));
      }
    },
    [dispatch, isEmployee, returnEmployeePreferencesObject, returnSelectedJobPreferencesObject],
  );

  const saveLocalValuesInDB = useCallback(
    (localStateObject: LocalStateObject) => {
      if (isEmployee) {
        dispatch(setIsGetDataForSwipingLoading(true));
        UsersService.updateEmployeePreferences({
          userId: loggedInUserId,
          preferencesObject: returnEmployeePreferencesObject(localStateObject),
        }).then(() => {
          dispatch(setIsGetDataForSwipingLoading(false));
        });
      } else {
        dispatch(setIsGetDataForSwipingLoading(true));
        JobsService.updateJobPreferences({
          jobId: selectedJobId,
          preferences: returnSelectedJobPreferencesObject(localStateObject),
        }).then(() => {
          dispatch(setIsGetDataForSwipingLoading(false));
        });
      }
    },
    [
      dispatch,
      isEmployee,
      loggedInUserId,
      returnEmployeePreferencesObject,
      returnSelectedJobPreferencesObject,
      selectedJobId,
    ],
  );

  const getNewSwipingData = useCallback(
    async (localStateObject: LocalStateObject) => {
      if (isEmployee) {
        const getJobsForSwiping = await JobsService.getJobsForSwiping({
          userId: loggedInUserId,
          preferences: returnEmployeePreferencesObject(localStateObject),
        });
        dispatch(setSwipingDataRedux(getJobsForSwiping));
      } else {
        const getEmployeesForSwiping = await UsersService.getEmployeesForSwiping({
          jobId: selectedJobId,
          preferences: returnSelectedJobPreferencesObject(localStateObject),
        });
        dispatch(setSwipingDataRedux(getEmployeesForSwiping));
      }
    },
    [
      dispatch,
      isEmployee,
      loggedInUserId,
      returnEmployeePreferencesObject,
      returnSelectedJobPreferencesObject,
      selectedJobId,
    ],
  );

  const applyFilters = useCallback(
    (localStateObject: LocalStateObject) => {
      dispatch(setSwipingDataRedux([]));
      saveLocalValuesInRedux(localStateObject);
      saveLocalValuesInDB(localStateObject);
      getNewSwipingData(localStateObject);
      closeBottomSheet();
    },
    [closeBottomSheet, dispatch, getNewSwipingData, saveLocalValuesInDB, saveLocalValuesInRedux],
  );

  const closeIsBrowsingLikeAlertModal = useCallback(() => {
    setIsBrowsingLikeAlertOpen(false);
  }, []);

  const navigateToProfileTab = useCallback(() => {
    closeIsBrowsingLikeAlertModal();
    navigation.navigate('Root', { screen: 'Sign Up' });
  }, [closeIsBrowsingLikeAlertModal, navigation]);

  const returnAlertModalSubtitle = useCallback(() => {
    if (isEmployee) {
      if (isLoggedIn) {
        return `You can't filter until you finishing creating a profile`;
      } else {
        return `You can't filter until you sign up and create a profile`;
      }
    } else if (isLoggedIn) {
      return `You can't filter until you create a job`;
    } else {
      return `You can't filter until you sign up and create a job`;
    }
  }, [isEmployee, isLoggedIn]);

  const returnAlertModalConfirmText = useCallback(() => {
    if (isEmployee) {
      if (isLoggedIn) {
        return 'Finish Profile';
      } else {
        return 'Sign Up';
      }
    } else if (isLoggedIn) {
      return 'Create Job';
    } else {
      return 'Sign Up';
    }
  }, [isEmployee, isLoggedIn]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={['top']}>
      <View style={styles.container}>
        <AlertModal
          isOpen={isBrowsingLikeAlertOpen}
          title={`You're in preview mode`}
          subTitle={returnAlertModalSubtitle()}
          closeModal={closeIsBrowsingLikeAlertModal}
          onConfirmPress={navigateToProfileTab}
          confirmText={returnAlertModalConfirmText()}
          denyText='Keep Browsing'
        />
        {employersJobs?.length === 0 && (
          <TouchableOpacity style={styles.previewContainer} onPress={navigateToProfileTab}>
            <AppHeaderText style={styles.previewText}>Preview Mode</AppHeaderText>
            <AppBoldText style={styles.previewSubtitleText}>
              Tap here to post a job and gain full access to our dev database
            </AppBoldText>
          </TouchableOpacity>
        )}

        <BottomSheet
          isOpen={!!selectedFilter}
          closeModal={closeBottomSheet}
          rowNumber={selectedFilter === 'Skills' ? 4 : 3}
          closeWithXButton>
          <BottomSheetFilterContent selectedFilter={selectedFilter} applyFilters={applyFilters} />
        </BottomSheet>
        {!isNew && (
          <KeeperSelectDropdown
            data={employersJobs || []}
            // data={removeSelectedJobFromDropdownData()}
            value={selectedJobTitle || ''}
            subTitle={selectedJobCompanyName}
            onSelectItem={onNewJobSelect}
            valueString={'settings.title'}
          />
        )}
        <View style={styles.filterContainer}>
          <ScrollView style={styles.filterScrollView} horizontal showsHorizontalScrollIndicator={false}>
            {filterList.map((filterName: string, index: number) => {
              return (
                <Chip
                  key={filterName}
                  name={filterName}
                  onSelectChip={() => onPressFilterChip(filterName)}
                  containerStyles={[styles.chipContainerStyles, index + 1 === filterList.length ? styles.lastChip : {}]}
                  textStyles={styles.chipTextStyles}
                  iconName='angle-down'
                />
              );
            })}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmployerDiscoverHeader;
