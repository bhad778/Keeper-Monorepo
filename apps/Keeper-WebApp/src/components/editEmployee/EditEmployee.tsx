import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setSwipingDataRedux, addLoggedInUser } from 'reduxStore';
import {
  TEmployeeSettings,
  TEmployeeEducation,
  EmploymentTypes,
  TOnsiteSchedule,
  TFrontendBackendOptions,
  TCompanySize,
} from 'keeperTypes';
import {
  AppBoldText,
  KeeperSelectButton,
  OpenModalItem,
  Header,
  LargeDescriptionModal,
  AppHeaderText,
  KeeperModal,
  SpinnerOverlay,
  EducationHistory,
  JobHistoryModal,
  ResumeComponent,
  SectionContainer,
  SubHeaderLarge,
  KeeperTextInput,
  BackButton,
  AlertModal,
  KeeperSlider,
} from 'components';
import { LocationModal, LogoModal, RequiredSkillsModal } from 'modals';
import { UsersService } from 'services';
import { useDidMountEffect, useFormCounter } from 'hooks';
import {
  onSiteOptions,
  backoutWithoutSavingTitle,
  backoutWithoutSavingSubTitle,
  employmentTypeOptions,
  frontendBackendOptions,
  companySizeOptions,
} from 'constants/globalConstants';
import toast from 'react-hot-toast';
import { FormControlLabel, Grid, Switch } from '@mui/material';
import { styled } from '@mui/styles';
import { useTheme } from 'theme/theme.context';

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
  editEmployeeData?: {
    employeeSettings: typeof blankEditEmployeeState;
    _id: string | undefined;
  };
};

const EditEmployee = ({ editEmployeeData }: EditEmployeeProps) => {
  const isNewEmployee = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);

  const [editEmployeeState, setEditEmployeeState] = useState(
    editEmployeeData?.employeeSettings || blankEditEmployeeState,
  );
  const [isLoading, setIsLoading] = useState(false);
  // const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [hasCheckBeenPressed, setHasCheckBeenPressed] = useState(false);
  // const [hasUploadedResume, setHasUploadedResume] = useState(false);
  const [requiredSkillsModalVisible, setRequiredSkillsModalVisible] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);

  // this variable determines if preview resume is showing the real saved data
  // or the currently editting data. You normally always see the real saved data,
  // unless you click edit, then you are in an editting mode unless you press save
  // or press back and back out without saving changes
  const [isPreviewMode, setIsPreviewMode] = useState(!isNewEmployee);

  // const { uploadResumeToParser } = useThirdPartyService();
  const dispatch = useDispatch();
  const styles = useStyles();
  const { uncompletedFieldsArray, returnErrorStyles } = useFormCounter(
    editEmployeeState,
    hasCheckBeenPressed,
    true,
    false,
    // hasUploadedResume
  );
  const theme = useTheme();

  // this updates data in backend as employee types when theyre not logged in
  // useDidMountEffect(() => {
  //   if (isNewEmployee) {
  //     debouncedUpdateEmployeeNotLoggedIn();
  //   }
  // }, [isNewEmployee, editEmployeeState]);

  useDidMountEffect(() => {
    setEditEmployeeState(employeeSettings);
  }, [employeeSettings]);

  useDidMountEffect(() => {
    if (!isNewEmployee) {
      setIsPreviewMode(true);
    }
  }, [isNewEmployee]);

  useDidMountEffect(() => {
    setDataHasChanged(true);
  }, [editEmployeeState]);

  // const openPdfSelector = async (event: any) => {
  //   const file = event.target.files[0];

  //   const base64String = await convertBase64(file);

  //   if (typeof base64String === 'string') {
  //     const blob = await convertBase64ToBlob(base64String);

  //     setIsResumeUploading(true);

  //     try {
  //       const jsonResume = await uploadResumeToParser(blob);
  //       if (jsonResume?.data) {
  //         const transformedJsonResume = affindaResumeTransformer(jsonResume.data);
  //         setEditEmployeeState((prevState: any) => {
  //           return { ...prevState, ...transformedJsonResume };
  //         });
  //         setHasUploadedResume(true);

  //         toast.success(`${Math.floor(Math.random() * (30 - 10 + 1) + 10)} jobs fit your experience in our system!`);
  //       }

  //       setIsResumeUploading(false);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };

  const resetEditEmployeeState = () => {
    setEditEmployeeState(employeeSettings);
  };

  const updateEmployee = async (isIncomplete?: boolean) => {
    if (!isIncomplete) {
      setIsLoading(true);
    }

    // editJobData will always have an _id field, were just doing this to satisfy typescript
    if (editEmployeeData?._id) {
      const updateObject = {
        userId: editEmployeeData?._id,
        accountType: 'employee',
        lastUpdatedOnWeb: true,
        isIncomplete: !!isIncomplete,
        newSettings: { ...editEmployeeState },
      };

      updateObject.newSettings.relevantSkills = editEmployeeState.relevantSkills;

      // update redux employeeSettings aka resume in redux
      // dispatch(updateResumeData(editEmployeeState));
      // make same update in DB
      try {
        const updateUserResponse = await UsersService.updateUserSettings(updateObject);
        if (!isIncomplete) {
          dispatch(setSwipingDataRedux(updateUserResponse.itemsForSwiping));
        }
        const userUpdateData = updateUserResponse.userData;
        userUpdateData.preferences.isNew = !!isIncomplete;
        dispatch(addLoggedInUser(userUpdateData));

        setIsPreviewMode(true);
        setDataHasChanged(false);
        resetEditEmployeeState();
        if (!isIncomplete) {
          toast.success(`Profile successfully saved!`);
        }
      } catch (err) {
        console.error(err);
        if (!isIncomplete) {
          toast.error(`Profile save failed, try again later`);
        }
      }
    }
    setIsLoading(false);
  };

  // const debouncedUpdateEmployeeNotLoggedIn = useDebounce(async () => {
  //   updateEmployee(true);
  // }, 400);

  const onCheckPress = async () => {
    if (uncompletedFieldsArray.length > 0) {
      setIsBottomSheetOpen(true);
      setHasCheckBeenPressed(true);
      setIsPreviewMode(false);
      return;
    } else {
      updateEmployee();
    }
  };

  const updateEmployeeState = useCallback(
    (value: any, field: keyof TEmployeeSettings) => {
      if (
        field === 'onSiteOptionsOpenTo' ||
        field === 'employmentTypesOpenTo' ||
        field === 'companySizeOptionsOpenTo' ||
        field === 'frontendBackendOptionsOpenTo'
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

  // const returnNoBottomBorderStyles = useCallback(() => {
  //   if (hasUploadedResume || !isNewEmployee) {
  //     return styles.openModalItem;
  //   } else {
  //     return { ...styles.noBottomBorder, ...styles.openModalItem };
  //   }
  // }, [hasUploadedResume, isNewEmployee, styles.noBottomBorder, styles.openModalItem]);

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
    (uncompletedFieldsArray: (keyof TEmployeeSettings)[]) => {
      let finalString = '';
      uncompletedFieldsArray.map(field => {
        finalString += mapUncompletedFieldsToTitles(field) + ', ';
      });
      // slice -2 to remove the last comma and space
      return finalString.slice(0, -2);
    },
    [mapUncompletedFieldsToTitles],
  );

  const closePreviewMode = () => {
    setIsPreviewMode(false);
  };

  const backOutOfEditingWithoutSaving = () => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      setIsPreviewMode(true);
    }
  };

  const returnTopButtons = () => {
    if (isPreviewMode) {
      return <KeeperSelectButton onClick={closePreviewMode} title='Edit Profile' />;
    } else {
      return (
        <KeeperSelectButton
          onClick={onCheckPress}
          title='Save Changes'
          buttonStyles={styles.saveJobButton}
          textStyles={styles.saveJobButtonText}
        />
      );
    }
  };

  const returnBackButton = () => {
    if (isNewEmployee) {
      return;
    } else if (!isPreviewMode) {
      return <BackButton onClick={backOutOfEditingWithoutSaving} />;
    }
  };

  const onConfirmAlertModalPress = () => {
    closeAlertModal();
    setIsPreviewMode(true);
    setDataHasChanged(false);
    resetEditEmployeeState();
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const onYearsOfExprienceSliderComplete = useCallback(
    (value: number) => {
      updateEmployeeState(value, 'yearsOfExperience');
    },
    [updateEmployeeState],
  );

  const onSwitchPress = () => {
    setIsPreviewMode(prev => !prev);
  };

  const PinkSwitch = styled(Switch)(() => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#F4C0FF',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#F4C0FF',
    },
    '& .MuiSwitch-track': {
      backgroundColor: '#F4C0FF',
    },
  }));

  return (
    <>
      {!isNewEmployee && (
        <FormControlLabel
          sx={styles.editModeSwitch}
          control={<PinkSwitch checked={isPreviewMode} onChange={onSwitchPress} />}
          labelPlacement='top'
          label='Toggle Edit Mode'
        />
      )}

      {isLoading && <SpinnerOverlay />}
      {returnBackButton()}
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={onConfirmAlertModalPress}
      />

      <KeeperModal isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} modalStyles={styles.finishFieldsModal}>
        <div style={styles.finishFieldsTitleContainer}>
          <AppHeaderText style={styles.bottomSheetText}>Finish the Following Fields Before Submitting!</AppHeaderText>
        </div>

        <div style={styles.uncompletedFieldsContainer}>
          <AppBoldText style={styles.uncompletedFieldsString}>
            {returnUncompletedFieldsString(uncompletedFieldsArray)}
          </AppBoldText>
        </div>
      </KeeperModal>

      {isPreviewMode ? (
        <ResumeComponent isOwner={true} currentEmployeeSettings={employeeSettings} />
      ) : (
        <>
          <Grid spacing={4} container style={styles.container}>
            <div style={styles.saveButtonContainer}>{returnTopButtons()}</div>

            {requiredSkillsModalVisible && (
              <RequiredSkillsModal
                requiredSkills={editEmployeeState?.relevantSkills || []}
                setRequiredSkills={value => updateEmployeeState(value, 'relevantSkills')}
                setRequiredSkillsModalVisible={setRequiredSkillsModalVisible}
              />
            )}

            {locationModalVisible && (
              <LocationModal
                address={editEmployeeState.address || ''}
                setAddress={value => updateEmployeeState(value, 'address')}
                setLocationModalVisible={setLocationModalVisible}
                // 80467 meters is 50 miles
                searchRadius={editEmployeeState?.searchRadius || 50}
                onSiteOptionsOpenTo={editEmployeeState?.onSiteOptionsOpenTo || []}
                updateState={updateEmployeeState}
              />
            )}

            <Grid style={styles.grid1} item sm={12} md={4.5} xl={4}>
              <LogoModal
                logo={editEmployeeState.img || ''}
                setLogo={value => updateEmployeeState(value, 'img')}
                isEmployee
                isError={hasCheckBeenPressed && !editEmployeeState.img}
                style={{ maxHeight: '50vh', objectFit: 'cover' }}
              />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  marginBottom: 15,
                }}></div>

              <KeeperTextInput
                value={editEmployeeState.firstName}
                label='First Name'
                errorTextStyles={returnErrorStyles('firstName')}
                onChange={value => updateEmployeeState(value, 'firstName')}
              />
              <KeeperTextInput
                value={editEmployeeState.lastName}
                label='Last Name'
                errorTextStyles={returnErrorStyles('lastName')}
                onChange={value => updateEmployeeState(value, 'lastName')}
              />
              <KeeperTextInput
                value={editEmployeeState.jobTitle}
                label='Ideal Job Title'
                errorTextStyles={returnErrorStyles('jobTitle')}
                onChange={value => updateEmployeeState(value, 'jobTitle')}
              />

              <SectionContainer
                containerStyles={{ ...styles.grid1SectionContainer, ...styles.employmentTypeContainer }}>
                <SubHeaderLarge
                  text={`Employment Type(s) You're Open To`}
                  errorTextStyles={{ ...returnErrorStyles('employmentTypesOpenTo'), ...styles.grid1SubHeader }}
                />
                <div style={styles.keeperSelectButtonsContainer}>
                  {employmentTypeOptions.map((option: EmploymentTypes, index: number) => {
                    return (
                      <KeeperSelectButton
                        key={index}
                        onClick={value => updateEmployeeState(value, 'employmentTypesOpenTo')}
                        title={option}
                        selected={editEmployeeState.employmentTypesOpenTo?.includes(option)}
                        selectedButtonStyles={styles.selectedButtonStyles}
                        unSelectedButtonStyles={styles.unSelectedButtonStyles}
                        buttonStyles={styles.employmentTypeButtons}
                        textStyles={styles.workSettingButtonText}
                        unSelectedTextStyles={styles.unSelectedTextStyles}
                        selectedTextStyles={styles.selectedTextStyles}
                      />
                    );
                  })}
                </div>
              </SectionContainer>

              <SectionContainer containerStyles={styles.grid1SectionContainer}>
                <SubHeaderLarge
                  text={`Stack Preference(s) You're Open To`}
                  textInputLabelStyle={{
                    ...returnErrorStyles('frontendBackendOptionsOpenTo'),
                    ...styles.grid1SubHeader,
                  }}
                />
                <div style={styles.keeperSelectButtonsContainer}>
                  {frontendBackendOptions.map((option: TFrontendBackendOptions, index: number) => {
                    return (
                      <KeeperSelectButton
                        key={index}
                        onClick={value => updateEmployeeState(value, 'frontendBackendOptionsOpenTo')}
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
                </div>
              </SectionContainer>

              <SectionContainer containerStyles={styles.grid1SectionContainer}>
                <SubHeaderLarge
                  text={`Company Size(s) You're Open To`}
                  textInputLabelStyle={{ ...returnErrorStyles('companySizeOptionsOpenTo'), ...styles.grid1SubHeader }}
                />
                <div style={styles.keeperSelectButtonsContainer}>
                  {companySizeOptions.map((option: TCompanySize, index: number) => {
                    return (
                      <KeeperSelectButton
                        key={index}
                        onClick={value => updateEmployeeState(value, 'companySizeOptionsOpenTo')}
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
                </div>
              </SectionContainer>

              <SectionContainer containerStyles={styles.grid1SectionContainer}>
                <SubHeaderLarge
                  text={`Work Setting(s) You're Open To`}
                  textInputLabelStyle={{ ...returnErrorStyles('onSiteOptionsOpenTo'), ...styles.grid1SubHeader }}
                />
                <div style={styles.keeperSelectButtonsContainer}>
                  {onSiteOptions.map((option: TOnsiteSchedule, index: number) => {
                    return (
                      <KeeperSelectButton
                        key={index}
                        onClick={value => updateEmployeeState(value, 'onSiteOptionsOpenTo')}
                        title={option}
                        selected={editEmployeeState.onSiteOptionsOpenTo?.includes(option)}
                        selectedButtonStyles={styles.selectedButtonStyles}
                        selectedTextStyles={styles.selectedTextStyles}
                        unSelectedButtonStyles={styles.unSelectedButtonStyles}
                        buttonStyles={styles.workSettingButtons}
                        textStyles={styles.workSettingButtonText}
                        unSelectedTextStyles={styles.unSelectedTextStyles}
                      />
                    );
                  })}
                </div>
              </SectionContainer>

              <SectionContainer containerStyles={styles.grid1SectionContainer}>
                <SubHeaderLarge
                  text='Are You Authorized to Work in the U.S.?'
                  textInputLabelStyle={{ ...returnErrorStyles('isUsCitizen'), ...styles.grid1SubHeader }}
                />
                <div style={styles.keeperSelectButtonsContainer}>
                  <KeeperSelectButton
                    onClick={() => updateEmployeeState(true, 'isUsCitizen')}
                    title='Yes'
                    selected={editEmployeeState.isUsCitizen && editEmployeeState.isUsCitizen != null}
                    selectedButtonStyles={styles.selectedButtonStyles}
                    buttonStyles={styles.employmentTypeButtons}
                    unSelectedButtonStyles={styles.unSelectedButtonStyles}
                    unSelectedTextStyles={styles.unSelectedTextStyles}
                    selectedTextStyles={styles.selectedTextStyles}
                  />
                  <KeeperSelectButton
                    onClick={() => updateEmployeeState(false, 'isUsCitizen')}
                    title='No'
                    selected={!editEmployeeState.isUsCitizen && editEmployeeState.isUsCitizen != null}
                    selectedButtonStyles={styles.selectedButtonStyles}
                    unSelectedButtonStyles={styles.unSelectedButtonStyles}
                    buttonStyles={styles.citizenButtons}
                    unSelectedTextStyles={styles.unSelectedTextStyles}
                    selectedTextStyles={styles.selectedTextStyles}
                  />
                </div>
              </SectionContainer>

              <SectionContainer containerStyles={styles.grid1SectionContainer}>
                <SubHeaderLarge
                  text={`Years of Dev Experience`}
                  errorTextStyles={{ ...returnErrorStyles('yearsOfExperience'), ...styles.grid1SubHeader }}
                />
                <KeeperSlider
                  minimumValue={0}
                  maximumValue={20}
                  step={1}
                  defaultValue={editEmployeeState.yearsOfExperience}
                  onSliderComplete={onYearsOfExprienceSliderComplete}
                />
              </SectionContainer>
            </Grid>
            <Grid item style={styles.grid2} sm={12} md={7.5} xl={8}>
              <SectionContainer>
                <Header
                  textInputLabelStyle={{ paddingTop: 10 }}
                  text='About Me'
                  errorTextStyles={returnErrorStyles('aboutMeText')}
                />
                <LargeDescriptionModal
                  text={editEmployeeState.aboutMeText || ''}
                  setText={(value: string) => updateEmployeeState(value, 'aboutMeText')}
                  placeholder='Tell us a little bit about yourself...'
                />
              </SectionContainer>

              <SectionContainer>
                <Header errorTextStyles={returnErrorStyles('jobHistory')} text='Job History' />
                <JobHistoryModal
                  shouldTextBeWhite
                  jobHistory={editEmployeeState.jobHistory || []}
                  setJobHistory={(value: any) => updateEmployeeState(value, 'jobHistory')}
                  isSeekingFirstJob={editEmployeeState.isSeekingFirstJob}
                  setIsSeekingFirstJob={value => updateEmployeeState(value, 'isSeekingFirstJob')}
                  hasCheckBeenPressed={hasCheckBeenPressed}
                  // hasUploadedResume={hasUploadedResume}
                  hasUploadedResume={false}
                  uncompletedFieldsArray={uncompletedFieldsArray}
                />
              </SectionContainer>

              <SectionContainer>
                <Header errorTextStyles={returnErrorStyles('educationHistory')} text='Education History' />
                <EducationHistory
                  educationHistory={editEmployeeState?.educationHistory || []}
                  setEducationHistory={(value: TEmployeeEducation[]) => updateEmployeeState(value, 'educationHistory')}
                  hasCheckBeenPressed={hasCheckBeenPressed}
                  // hasUploadedResume={hasUploadedResume}
                  hasUploadedResume={false}
                />
              </SectionContainer>

              <SectionContainer>
                <OpenModalItem
                  onClick={() => setLocationModalVisible(true)}
                  title='City'
                  isAppText
                  values={editEmployeeState.address}
                  titleStyles={returnErrorStyles('address')}
                />
              </SectionContainer>

              <SectionContainer>
                <OpenModalItem
                  onClick={() => setRequiredSkillsModalVisible(true)}
                  title='Skills'
                  isAppText
                  values={editEmployeeState.relevantSkills}
                  titleStyles={returnErrorStyles('relevantSkills')}
                />
              </SectionContainer>

              {/* {isNewEmployee && !hasUploadedResume && (
                <>
                  <div style={{ ...styles.jobTitleContainer, ...styles.resumeLabel }}>
                    <AppBoldText style={styles.appText}>Auto-Fill Job History and Education With Resume</AppBoldText>
                  </div>
                  <div style={styles.uploadResumeButtonContainer}>
                    <Button
                      style={{
                        ...styles.addResumeButton,
                        textTransform: 'capitalize',
                      }}
                      variant="contained"
                      component="label"
                    >
                      {isResumeUploading ? (
                        <LoadingSpinner size="30" />
                      ) : (
                        <AppBoldText style={styles.uploadResumeText}>Upload Resume</AppBoldText>
                      )}

                      <input hidden accept=".pdf" type="file" onChange={openPdfSelector} />
                    </Button>
                  </div>
                </>
              )} */}

              {/* <KeeperSelectButton
                onClick={onCheckPress}
                title={isNewEmployee ? 'SUBMIT' : 'SAVE CHANGES'}
                buttonStyles={styles.previewJobButton}
                textStyles={styles.previewJobButtonText}
              /> */}
            </Grid>
          </Grid>
        </>
      )}
    </>
  );
};

export default EditEmployee;
