import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, AppState } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setSwipingDataRedux, addLoggedInUser, updateResumeData } from 'reduxStore';
import {
  TEmployeeSettings,
  TEmployeeEducation,
  EmploymentTypes,
  TFrontendBackendOptions,
  TOnsiteSchedule,
  TCompanySize,
} from 'keeperTypes';
import {
  AppBoldText,
  KeeperSelectButton,
  KeeperSpinnerOverlay,
  OpenModalItem,
  EditProfileTitle,
  EditProfileTextInput,
  LargeDescriptionBubble,
  RedesignHeader,
  LargeDescriptionModal,
  BottomSheet,
  AppHeaderText,
  KeeperSlider,
  BackButton,
} from 'components';
import {
  LocationModal,
  LogoModal,
  PreviewJobModal,
  JobHistoryModal,
  EducationHistoryModal,
  AlertModal,
  RequiredSkillsModal,
  SettingsModal,
} from 'modals';
import { UsersService, useThirdPartyService } from 'services';
import { selectFile, affindaResumeTransformer } from 'projectUtils';
import { ViewResume } from 'screens';
import { useFormCounter } from 'hooks';
import Toast from 'react-native-toast-message';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  backoutWithoutSavingSubTitle,
  backoutWithoutSavingTitle,
  companySizeOptions,
  employmentTypeOptions,
  frontendBackendOptions,
  onSiteOptions,
} from 'constants/globalConstants';

import CogIcon from '../../assets/svgs/settingsIconWhite.svg';
import { useStyles } from './EditEmployeeStyles';

const blankEditEmployeeState: TEmployeeSettings = {
  img: undefined,
  address: undefined,
  lastName: undefined,
  firstName: undefined,
  aboutMeText: undefined,
  jobTitle: undefined,
  jobHistory: undefined,
  searchRadius: 50,
  educationHistory: undefined,
  yearsOfExperience: undefined,
  onSiteOptionsOpenTo: undefined,
  isUsCitizen: undefined,
  isSeekingFirstJob: undefined,
  employmentTypesOpenTo: undefined,
  relevantSkills: undefined,
  frontendBackendOptionsOpenTo: undefined,
  companySizeOptionsOpenTo: undefined,
};

type EditEmployeeProps = {
  setEditEmployeeModalVisible?: (isVisible: boolean) => void;
  editEmployeeData?: { employeeSettings: typeof blankEditEmployeeState; _id: string | undefined };
  isCreatingProfile?: boolean;
  isModal?: boolean;
};

const EditEmployee = ({
  setEditEmployeeModalVisible,
  editEmployeeData,
  isCreatingProfile,
  isModal,
}: EditEmployeeProps) => {
  const isNewEmployee = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);

  const appState = useRef(AppState.currentState);

  const [editEmployeeState, setEditEmployeeState] = useState(
    editEmployeeData?.employeeSettings || blankEditEmployeeState,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [educationHistoryModalVisible, setEducationHistoryModalVisible] = useState(false);
  const [aboutYouModalVisible, setAboutYouModalVisible] = useState(false);
  const [jobHistoryModalVisible, setJobHistoryModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [hasCheckBeenPressed, setHasCheckBeenPressed] = useState(false);
  const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [requiredSkillsModalVisible, setRequiredSkillsModalVisible] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isKeeperProModalOpen, setIsKeeperProModalOpen] = useState(false);

  const { uploadResumeToParser } = useThirdPartyService();
  const dispatch = useDispatch();
  const styles = useStyles(isModal);
  const { uncompletedFieldsArray, returnErrorStyles } = useFormCounter(
    editEmployeeState,
    hasCheckBeenPressed,
    true,
    hasUploadedResume,
  );

  useEffect(() => {
    // fire when app goes to the background
    const subscription = AppState.addEventListener('change', async (nextAppState: any) => {
      if (appState.current.match(/inactive|background|active/) && nextAppState === 'inactive' && isNewEmployee) {
        updateEmployee(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isNewEmployee]);

  const openPdfSelector = async () => {
    const blob = await selectFile();

    if (typeof blob === 'string') {
      setIsLoading(true);

      try {
        const jsonResume = await uploadResumeToParser(blob);
        if (jsonResume?.data) {
          const transformedJsonResume = affindaResumeTransformer(jsonResume.data);
          setEditEmployeeState((prevState: any) => {
            return { ...prevState, ...transformedJsonResume };
          });
          setHasUploadedResume(true);
          Toast.show({
            type: 'success',
            text1: `${Math.floor(Math.random() * (30 - 10 + 1) + 10)} jobs fit your experience in our system!`,
            position: 'bottom',
            visibilityTime: 1500,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const closeEditEmployeeModal = useCallback(() => {
    if (setEditEmployeeModalVisible) {
      setEditEmployeeModalVisible(false);
    }

    setDataHasChanged(false);
  }, [setEditEmployeeModalVisible]);

  const openSettings = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettings = () => {
    setIsSettingsModalOpen(false);
  };

  const onBackPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeEditEmployeeModal();
    }
  }, [closeEditEmployeeModal, dataHasChanged]);

  const previewEmployeeData: TEmployeeSettings = {
    img: editEmployeeState.img || 'empty',
    address: editEmployeeState.address || 'City, State',
    firstName: editEmployeeState.firstName || 'Lorem',
    lastName: editEmployeeState.lastName || 'Ipsum',
    // email: editEmployeeState.email || 'Email',
    aboutMeText:
      editEmployeeState.aboutMeText ||
      `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum`,
    jobTitle: editEmployeeState.jobTitle || 'Job Title',
    yearsOfExperience: editEmployeeState.yearsOfExperience || 8,
    onSiteOptionsOpenTo: editEmployeeState.onSiteOptionsOpenTo || ['Remote', 'Hybrid'],
    employmentTypesOpenTo: editEmployeeState.employmentTypesOpenTo || ['Salary', 'Contract'],
    isUsCitizen: editEmployeeState.isUsCitizen,
    // if they have jobHistory, and theyre not seeking first job, then show skills based on job history
    // if theyre seeking first job and they have selected relevant skills, show those
    // if theyre seeking first job, and they have no skills, show example skills.
    relevantSkills:
      editEmployeeState?.relevantSkills && editEmployeeState?.relevantSkills?.length > 0
        ? editEmployeeState.relevantSkills
        : ['Example Skill', 'Example Skill'],
    jobHistory: editEmployeeState?.jobHistory || [
      {
        uuid: '1111111',
        jobTitle: 'Job Title',
        company: 'Company Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        jobDescription:
          'Job Description, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
      },
      {
        uuid: '2222222',
        jobTitle: 'Job Title',
        company: 'Company Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        jobDescription:
          'Job Description, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
      },
      {
        uuid: '3333333',
        jobTitle: 'Job Title',
        company: 'Company Name',
        startDate: 'Start Date',
        endDate: 'End Date',
        jobDescription:
          'Job Description, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore',
      },
    ],
    educationHistory: editEmployeeState.educationHistory || [
      {
        uuid: '444444',
        school: 'School Name- ',
        major: 'Major',
        endDate: 'End Date',
        degree: `Degree`,
      },
    ],
    isSeekingFirstJob: editEmployeeState.isSeekingFirstJob || false,
    searchRadius: 50,
  };

  const updateEmployee = useCallback(
    async (isIncomplete?: boolean) => {
      if (uncompletedFieldsArray.length > 0) {
        setIsBottomSheetOpen(true);
        setHasCheckBeenPressed(true);
        return;
      }
      // editJobData will always have an _id field, were just doing this to satisfy typescript
      if (!isIncomplete) {
        setIsLoading(true);
      }

      if (editEmployeeData?._id) {
        const updateObject = {
          userId: editEmployeeData?._id,
          accountType: 'employee',
          lastUpdatedOnWeb: false,
          isIncomplete: !!isIncomplete,
          newSettings: editEmployeeState,
        };

        // update redux employeeSettings aka resume in redux
        // dispatch(updateResumeData(editEmployeeState));
        // make same update in DB
        try {
          const updateUserResponse = await UsersService.updateUserSettings(updateObject);
          dispatch(setSwipingDataRedux(updateUserResponse.itemsForSwiping));
          dispatch(addLoggedInUser(updateUserResponse.userData));
          dispatch(updateResumeData(updateUserResponse.userData.settings));

          closeEditEmployeeModal();

          if (!isIncomplete) {
            Toast.show({
              type: 'success',
              text1: `Profile successfully saved!`,
              position: 'bottom',
              visibilityTime: 1500,
            });
            // navigation.navigate('Root', { screen: 'Discover' });
          }
        } catch (err) {
          console.error(err);
          if (!isIncomplete) {
            Toast.show({
              type: 'success',
              text1: `Profile save failed, try again later`,
              position: 'bottom',
              visibilityTime: 1500,
            });
          }
        }

        setDataHasChanged(false);
      }
      setIsLoading(false);
    },
    [closeEditEmployeeModal, dispatch, editEmployeeData?._id, editEmployeeState, uncompletedFieldsArray.length],
  );

  // const onCheckPress = useCallback(async () => {
  //   if (uncompletedFieldsArray.length > 0) {
  //     setIsBottomSheetOpen(true);
  //     setHasCheckBeenPressed(true);
  //     return;
  //   } else {
  //     try {
  //       await updateEmployee();

  //       // navigation.navigate('Root', { screen: 'Discover' });
  //     } catch (error) {
  //       console.error('There was an error updating profile', error);
  //     }
  //   }
  // }, [navigation, uncompletedFieldsArray.length, updateEmployee]);

  const updateEmployeeState = useCallback(
    (value: any, field: string) => {
      setDataHasChanged(true);
      if (
        field === 'onSiteOptionsOpenTo' ||
        field === 'employmentTypesOpenTo' ||
        field === 'frontendBackendOptionsOpenTo' ||
        field === 'companySizeOptionsOpenTo'
      ) {
        let currentArrayToChange = [...(editEmployeeState[field] || [])];

        if (currentArrayToChange.includes(value)) {
          currentArrayToChange = currentArrayToChange.filter(e => e !== value);
        } else {
          currentArrayToChange.push(value);
        }
        setEditEmployeeState((prevState: any) => {
          return { ...prevState, [field]: currentArrayToChange };
        });
      } else {
        setEditEmployeeState((prevState: any) => {
          return { ...prevState, [field]: value };
        });
      }
    },
    [editEmployeeState],
  );

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const mapUncompletedFieldsToTitles = useCallback((fieldName: keyof TEmployeeSettings) => {
    switch (fieldName) {
      case 'firstName':
        return 'First Name';
      case 'lastName':
        return 'Last Name';
      case 'img':
        return 'Profile Picture';
      case 'address':
        return 'Location';
      case 'aboutMeText':
        return 'About Me';
      case 'jobTitle':
        return 'Current Position';
      case 'isUsCitizen':
        return 'US Citizenship';
      case 'onSiteOptionsOpenTo':
        return 'On Site Options';
      case 'employmentTypesOpenTo':
        return 'Employment Types';
      case 'jobHistory':
        return 'Job History';
      case 'educationHistory':
        return 'Education History';
      case 'relevantSkills':
        return 'Skills';
      case 'frontendBackendOptionsOpenTo':
        return 'Stack Preference';
      case 'companySizeOptionsOpenTo':
        return 'CompanySize';
      default:
        return fieldName;
    }
  }, []);

  const returnUncompletedFieldsString = useCallback(
    (uncompletedFieldsArray: string[]) => {
      let finalString = '';
      uncompletedFieldsArray.map(field => {
        finalString += mapUncompletedFieldsToTitles(field) + ', ';
      });
      // slice -2 to remove the last comma and space
      return finalString.slice(0, -2);
    },
    [mapUncompletedFieldsToTitles],
  );

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const onKeeperProPress = useCallback(() => {
    setIsKeeperProModalOpen(true);
  }, []);

  const closeKeeperProModal = useCallback(() => {
    setIsKeeperProModalOpen(false);
  }, []);

  const onYearsOfExprienceSliderComplete = useCallback(
    (value: number) => {
      updateEmployeeState(value, 'yearsOfExperience');
    },
    [updateEmployeeState],
  );

  return (
    <>
      {/* <Modal animationType='slide' visible={editEmployeeModalVisible}> */}
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} rowNumber={3}>
        <AppHeaderText style={styles.bottomSheetText}>Finish the Following Fields Before Saving!</AppHeaderText>

        <AppBoldText style={styles.uncompletedFieldsString}>
          {returnUncompletedFieldsString(uncompletedFieldsArray)}
        </AppBoldText>
      </BottomSheet>

      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        closeSettings={closeSettings}
        isKeeperProModalOpen={isKeeperProModalOpen}
        closeKeeperProModal={closeKeeperProModal}
        onKeeperProPress={onKeeperProPress}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeEditEmployeeModal}
      />

      <KeeperSpinnerOverlay isLoading={isLoading} />
      {/* <ExperienceModal
          experience={editEmployeeState.yearsOfExperience}
          setExperience={(value: any) => updateEmployeeState(value, 'yearsOfExperience')}
          experienceModalVisible={experienceModalVisible}
          setExperienceModalVisible={setExperienceModalVisible}
        /> */}

      <RequiredSkillsModal
        requiredSkills={editEmployeeState?.relevantSkills || []}
        setRequiredSkills={value => updateEmployeeState(value, 'relevantSkills')}
        requiredSkillsModalVisible={requiredSkillsModalVisible}
        setRequiredSkillsModalVisible={setRequiredSkillsModalVisible}
      />

      <LocationModal
        address={editEmployeeState.address || ''}
        setAddress={value => updateEmployeeState(value, 'address')}
        locationModalVisible={locationModalVisible}
        setLocationModalVisible={setLocationModalVisible}
        // 80467 meters is 50 miles
        searchRadius={editEmployeeState?.searchRadius || 50}
        onSiteOptionsOpenTo={editEmployeeState?.onSiteOptionsOpenTo || []}
        updateState={updateEmployeeState}
      />
      <LargeDescriptionModal
        text={editEmployeeState.aboutMeText || ''}
        setText={(value: string) => updateEmployeeState(value, 'aboutMeText')}
        isVisible={aboutYouModalVisible}
        setIsVisible={setAboutYouModalVisible}
        title='About Me'
        placeholder='Tell us a little bit about yourself...'
      />
      <JobHistoryModal
        jobHistory={editEmployeeState.jobHistory || []}
        setJobHistory={(value: any) => updateEmployeeState(value, 'jobHistory')}
        jobHistoryModalVisible={jobHistoryModalVisible}
        setJobHistoryModalVisible={setJobHistoryModalVisible}
        isSeekingFirstJob={editEmployeeState.isSeekingFirstJob}
        setIsSeekingFirstJob={value => updateEmployeeState(value, 'isSeekingFirstJob')}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
        uncompletedFieldsArray={uncompletedFieldsArray}
      />
      <EducationHistoryModal
        educationHistory={editEmployeeState?.educationHistory || []}
        setEducationHistory={(value: TEmployeeEducation[]) => updateEmployeeState(value, 'educationHistory')}
        educationHistoryModalVisible={educationHistoryModalVisible}
        setEducationHistoryModalVisible={setEducationHistoryModalVisible}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
      />
      <PreviewJobModal isViewJobPostingModalVisible={isPreviewModalVisible}>
        <ViewResume
          previewEmployeeData={previewEmployeeData}
          closeResumePreviewModal={() => setIsPreviewModalVisible(false)}
          areAllFieldsCompleted={uncompletedFieldsArray.length === 0}
          onCheckPress={updateEmployee}
        />
      </PreviewJobModal>
      <View style={styles.scrollViewContainer}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={false}
          showsHorizontalScrollIndicator={false}>
          <RedesignHeader
            title='PROFILE'
            containerStyles={styles.noBottomBorder}
            rightContents={
              isNewEmployee
                ? { text: 'Preview', action: () => setIsPreviewModalVisible(true) }
                : { icon: 'check', action: updateEmployee }
            }>
            {!isNewEmployee && <BackButton goBackAction={onBackPress} />}
            {isNewEmployee && (
              <TouchableOpacity style={styles.leftIconTouchable} onPress={openSettings} hitSlop={30}>
                <CogIcon style={styles.cogIconStyles} />
              </TouchableOpacity>
            )}
          </RedesignHeader>

          <View style={styles.contents}>
            <LogoModal
              logo={editEmployeeState.img || ''}
              setLogo={value => updateEmployeeState(value, 'img')}
              isEmployee
              isError={hasCheckBeenPressed && !editEmployeeState.img}
            />

            <EditProfileTitle text='First Name' textStyles={returnErrorStyles('firstName')} />
            <EditProfileTextInput
              value={editEmployeeState.firstName}
              stateKeyName='firstName'
              onChangeText={updateEmployeeState}
            />

            <EditProfileTitle text='Last Name' textStyles={returnErrorStyles('lastName')} />
            <EditProfileTextInput
              value={editEmployeeState.lastName}
              stateKeyName='lastName'
              onChangeText={updateEmployeeState}
            />

            <EditProfileTitle text='Ideal Job Title' textStyles={returnErrorStyles('jobTitle')} />
            <EditProfileTextInput
              value={editEmployeeState.jobTitle}
              stateKeyName='jobTitle'
              onChangeText={updateEmployeeState}
            />

            <View style={styles.section}>
              <KeeperSlider
                title='Years Of Dev Experience'
                minimumValue={0}
                maximumValue={20}
                step={1}
                defaultValue={editEmployeeState.yearsOfExperience}
                onSliderComplete={onYearsOfExprienceSliderComplete}
              />
            </View>

            <View style={[styles.section, styles.workSettingsContainer]}>
              <EditProfileTitle
                text={`Work Setting(s) You're Open To`}
                textStyles={returnErrorStyles('onSiteOptionsOpenTo')}
              />
              <View style={styles.usCitizenContainer}>
                {onSiteOptions.map((option: TOnsiteSchedule, index: number) => {
                  return (
                    <KeeperSelectButton
                      key={index}
                      onPress={value => updateEmployeeState(value, 'onSiteOptionsOpenTo')}
                      title={option}
                      selected={editEmployeeState.onSiteOptionsOpenTo?.includes(option)}
                      selectedButtonStyles={styles.selectedButtonStyles}
                      unSelectedButtonStyles={styles.unSelectedButtonStyles}
                      buttonStyles={styles.workSettingButtons}
                      textStyles={styles.workSettingButtonText}
                      unSelectedTextStyles={styles.unSelectedTextStyles}
                    />
                  );
                })}
              </View>
            </View>

            <View style={[styles.section, styles.workSettingsContainer]}>
              <EditProfileTitle
                text={`Stack Preference(s) You're Open To`}
                textStyles={returnErrorStyles('frontendBackendOptionsOpenTo')}
              />
              <View style={styles.usCitizenContainer}>
                {frontendBackendOptions.map((option: TFrontendBackendOptions, index: number) => {
                  return (
                    <KeeperSelectButton
                      key={index}
                      onPress={value => updateEmployeeState(value, 'frontendBackendOptionsOpenTo')}
                      title={option}
                      selected={editEmployeeState.frontendBackendOptionsOpenTo?.includes(option)}
                      selectedButtonStyles={styles.selectedButtonStyles}
                      unSelectedButtonStyles={styles.unSelectedButtonStyles}
                      buttonStyles={styles.workSettingButtons}
                      textStyles={styles.workSettingButtonText}
                      unSelectedTextStyles={styles.unSelectedTextStyles}
                    />
                  );
                })}
              </View>
            </View>

            <View style={[styles.section, styles.workSettingsContainer]}>
              <EditProfileTitle
                text={`Company Size(s) You're Open To`}
                textStyles={returnErrorStyles('companySizeOptionsOpenTo')}
              />
              <View style={styles.usCitizenContainer}>
                {companySizeOptions.map((option: TCompanySize, index: number) => {
                  return (
                    <KeeperSelectButton
                      key={index}
                      onPress={value => updateEmployeeState(value, 'companySizeOptionsOpenTo')}
                      title={option}
                      selected={editEmployeeState.companySizeOptionsOpenTo?.includes(option)}
                      selectedButtonStyles={styles.selectedButtonStyles}
                      unSelectedButtonStyles={styles.unSelectedButtonStyles}
                      buttonStyles={styles.workSettingButtons}
                      textStyles={styles.workSettingButtonText}
                      unSelectedTextStyles={styles.unSelectedTextStyles}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <EditProfileTitle
                text={`Employment Type(s) You're Open To`}
                textStyles={returnErrorStyles('employmentTypesOpenTo')}
              />
              <View style={styles.usCitizenContainer}>
                {employmentTypeOptions.map((option: EmploymentTypes, index: number) => {
                  return (
                    <KeeperSelectButton
                      key={index}
                      onPress={value => updateEmployeeState(value, 'employmentTypesOpenTo')}
                      title={option}
                      selected={editEmployeeState.employmentTypesOpenTo?.includes(option)}
                      selectedButtonStyles={styles.selectedButtonStyles}
                      unSelectedButtonStyles={styles.unSelectedButtonStyles}
                      buttonStyles={styles.employmentTypeButtons}
                      textStyles={styles.workSettingButtonText}
                      unSelectedTextStyles={styles.unSelectedTextStyles}
                    />
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <EditProfileTitle
                text='Are you authorized to work in the U.S.?'
                textStyles={returnErrorStyles('isUsCitizen')}
              />
              <View style={styles.usCitizenContainer}>
                <KeeperSelectButton
                  onPress={() => updateEmployeeState(true, 'isUsCitizen')}
                  title='Yes'
                  selected={editEmployeeState.isUsCitizen && editEmployeeState.isUsCitizen != null}
                  selectedButtonStyles={styles.selectedButtonStyles}
                  unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.citizenButtons}
                  textStyles={styles.workSettingButtonText}
                  unSelectedTextStyles={styles.unSelectedTextStyles}
                />
                <KeeperSelectButton
                  onPress={() => updateEmployeeState(false, 'isUsCitizen')}
                  title='No'
                  selected={!editEmployeeState.isUsCitizen && editEmployeeState.isUsCitizen != null}
                  selectedButtonStyles={styles.selectedButtonStyles}
                  unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.citizenButtons}
                  textStyles={styles.workSettingButtonText}
                  unSelectedTextStyles={styles.unSelectedTextStyles}
                />
              </View>
            </View>

            <View style={styles.section}>
              <EditProfileTitle text='About Me' textStyles={returnErrorStyles('aboutMeText')} />
              <LargeDescriptionBubble
                bubbleText={editEmployeeState.aboutMeText}
                openEditModal={setAboutYouModalVisible}
                placeholderText='Tell us a little bit about yourself...'
              />
            </View>

            <OpenModalItem
              onPress={() => setLocationModalVisible(true)}
              title='Location'
              values={editEmployeeState.address}
              titleStyles={returnErrorStyles('address')}
              containerStyles={styles.openModalItem}
            />

            {/* <OpenModalItem
              onPress={() => setExperienceModalVisible(true)}
              title='Required Years of Experience'
              values={editEmployeeState.yearsOfExperience}
            /> */}

            {isCreatingProfile && !hasUploadedResume && (
              <>
                <View style={[styles.jobTitleContainer, styles.resumeLabel]}>
                  <AppBoldText style={styles.appText}>Auto-Fill Job History and Education With Resume</AppBoldText>
                </View>
                <KeeperSelectButton
                  onPress={openPdfSelector}
                  title='UPLOAD RESUME'
                  buttonStyles={styles.uploadResumeButton}
                  textStyles={styles.uploadResumeButtonText}
                />
              </>
            )}

            <OpenModalItem
              onPress={() => setRequiredSkillsModalVisible(true)}
              title='Skills'
              values={editEmployeeState.relevantSkills}
              titleStyles={returnErrorStyles('relevantSkills')}
              containerStyles={styles.openModalItem}
            />

            <OpenModalItem
              onPress={() => setJobHistoryModalVisible(true)}
              title='Job History'
              values={editEmployeeState.isSeekingFirstJob || editEmployeeState.jobHistory}
              titleStyles={returnErrorStyles('jobHistory')}
              containerStyles={styles.openModalItem}
            />

            <OpenModalItem
              onPress={() => setEducationHistoryModalVisible(true)}
              title='Education'
              containerStyles={[styles.noBottomBorder, styles.openModalItem]}
              values={editEmployeeState.educationHistory}
              titleStyles={returnErrorStyles('educationHistory')}
            />

            <KeeperSelectButton
              onPress={() => updateEmployee()}
              title={isNewEmployee ? 'SUBMIT' : 'SAVE'}
              buttonStyles={styles.previewJobButton}
              textStyles={styles.previewJobButtonText}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
      {/* </Modal> */}
    </>
  );
};

export default EditEmployee;
