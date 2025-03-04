import { useCallback, useEffect, useState } from 'react';
import { AlertModal, AppHeaderText, Chip, KeeperModal, KeeperSelectDropdown, ModalFilterContent } from 'components';
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
  TEmployerFilterListOptions,
  TFrontendBackendOptions,
  TJob,
  TJobPreferences,
  TWorkAuthOptions,
} from 'keeperTypes';
import { filterList } from 'constants/globalConstants';
import { JobsService, UsersService } from 'services';
import { RequiredSkillsModal } from 'modals';

import useStyles from './EmployerDiscoverHeaderStyles';
import { useNavigate } from 'react-router-dom';

type LocalStateObject = {
  localYearsOfExperience: number;
  localFrontendBackendSelections?: TFrontendBackendOptions[];
  localCompanySizeSelections?: TCompanySize[];
  localEmploymentTypeSelections?: EmploymentTypes[];
  localWorkAuthSelections?: TWorkAuthOptions[];
  localSkills?: string[];
};

const EmployerDiscoverHeader = () => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);
  const selectedJobColor = useSelector((state: RootState) => state.local.selectedJob.color);
  const selectedJobTitle = useSelector((state: RootState) => state.local.selectedJob.settings.title);
  const selectedJobImg = useSelector((state: RootState) => state.local.selectedJob.settings.img);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const selectedJobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  // const selectedJobCompanyName = useSelector((state: RootState) => state.local.selectedJob.settings.companyName);

  const [selectedFilter, setSelectedFilter] = useState<TEmployerFilterListOptions>();
  const [localSkills, setLocalSkills] = useState<string[]>();
  const [requiredSkillsModalVisible, setRequiredSkillsModalVisible] = useState(false);
  const [isBrowsingLikeAlertOpen, setIsBrowsingLikeAlertOpen] = useState(false);

  const { setSelectedJob } = useEmployer();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const styles = useStyles(selectedJobColor, employersJobs?.length > 0);

  const isEmployee = accountType === 'employee';

  useEffect(() => {
    setLocalSkills(selectedJobPreferences.relevantSkills);
  }, [selectedJobPreferences.relevantSkills]);

  const onNewJobSelect = useCallback(
    (selectedJob: TJob) => {
      setSelectedJob(selectedJob);
    },
    [setSelectedJob],
  );

  const returnEmployeePreferencesObject = useCallback(
    (localStateObject: LocalStateObject) => {
      const employeePreferencesTemp: TEmployeePreferences = {
        searchRadius: employeePreferences.searchRadius,
        requiredYearsOfExperience: localStateObject.localYearsOfExperience,
        geoLocation: employeePreferences.geoLocation,
        relevantSkills: localStateObject.localSkills || [],
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

  const closeFilterModal = useCallback(() => {
    setSelectedFilter(undefined);
  }, []);

  const applyFilters = useCallback(
    (localStateObject: LocalStateObject) => {
      dispatch(setSwipingDataRedux([]));
      saveLocalValuesInRedux(localStateObject);
      saveLocalValuesInDB(localStateObject);
      getNewSwipingData(localStateObject);
      closeFilterModal();
    },
    [closeFilterModal, dispatch, getNewSwipingData, saveLocalValuesInDB, saveLocalValuesInRedux],
  );

  const onPressFilterChip = (filterName: TEmployerFilterListOptions) => {
    if (employersJobs && employersJobs?.length === 0) {
      setIsBrowsingLikeAlertOpen(true);
    } else if (filterName === 'Skills') {
      setRequiredSkillsModalVisible(true);
    } else {
      setSelectedFilter(filterName);
    }
  };

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

  const closeIsBrowsingLikeAlertModal = useCallback(() => {
    setIsBrowsingLikeAlertOpen(false);
  }, []);

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

  const navigateToProfileTab = () => {
    if (isEmployee) {
      if (isLoggedIn) {
        navigate('/employeeHome/profile');
      } else {
        navigate('/profile');
      }
    } else {
      if (isLoggedIn) {
        navigate('/employerHome/jobBoard');
      } else {
        navigate('/profile');
      }
    }
  };

  return (
    <div style={styles.container}>
      {requiredSkillsModalVisible && (
        <RequiredSkillsModal
          requiredSkills={localSkills || []}
          setRequiredSkills={setLocalSkills}
          setRequiredSkillsModalVisible={setRequiredSkillsModalVisible}
          saveButtonData={{
            title: 'Apply Filters',
            action: (localSelectedChips: string[]) =>
              applyFilters({
                localYearsOfExperience: selectedJobPreferences.yearsOfExperience || 0,
                localSkills: localSelectedChips,
                localCompanySizeSelections: selectedJobPreferences.companySizeOptionsOpenTo,
                localFrontendBackendSelections: selectedJobPreferences.frontendBackendOptionsOpenTo,
                localEmploymentTypeSelections: selectedJobPreferences.employmentTypeOptionsOpenTo,
                localWorkAuthSelections: selectedJobPreferences.workAuthOptionsOpenTo,
              }),
          }}
        />
      )}
      <AlertModal
        isOpen={isBrowsingLikeAlertOpen}
        title={`You're in preview mode`}
        subTitle={returnAlertModalSubtitle()}
        closeModal={closeIsBrowsingLikeAlertModal}
        onConfirmPress={navigateToProfileTab}
        confirmText={returnAlertModalConfirmText()}
        denyText='Keep Browsing'
      />
      <KeeperModal isOpen={!!selectedFilter} closeModal={closeFilterModal} modalStyles={styles.modalStyles}>
        <ModalFilterContent selectedFilter={selectedFilter} applyFilters={applyFilters} />
      </KeeperModal>
      <div style={styles.subTitleContainer}>
        <AppHeaderText style={styles.title}>Candidates</AppHeaderText>

        <AppHeaderText style={styles.subTitle}>For:</AppHeaderText>
        <KeeperSelectDropdown
          // data={removeSelectedJobFromDropdownData()}
          data={employersJobs || []}
          value={selectedJobTitle || ''}
          valueImg={selectedJobImg || ''}
          onSelectItem={onNewJobSelect}
          valueString={'settings.title'}
        />
      </div>
      <div style={styles.filterContainer}>
        <div style={styles.horizontalFilterScroll}>
          {filterList.map(filterName => {
            return (
              <Chip
                key={filterName}
                name={filterName}
                onSelectChip={() => onPressFilterChip(filterName)}
                containerStyles={{ ...styles.chipContainerStyles }}
                textStyles={styles.chipTextStyles}
                hasDownArrow
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EmployerDiscoverHeader;
