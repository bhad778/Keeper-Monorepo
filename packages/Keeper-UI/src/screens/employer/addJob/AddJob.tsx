import React, { useCallback, useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Keyboard } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addEmployersJobs,
  addLoggedInUser,
  RootState,
  updateEmployerJobSettingsRedux,
  updateEmployersJob,
} from 'reduxStore';
import { TJob } from 'types';
import {
  AppHeaderText,
  BottomSheet,
  EditProfileTextInput,
  EditProfileTitle,
  BrandFetchAutocomplete,
  KeeperSelectButton,
  KeeperSpinnerOverlay,
  LargeDescriptionBubble,
  LargeDescriptionModal,
  OpenModalItem,
  RedesignHeader,
  BackButton,
} from 'components';
import {
  BenefitsModal,
  ExperienceModal,
  LocationModal,
  ResponsibilitiesModal2,
  Compensation,
  PreviewJobModal,
  LogoModal,
  AlertModal,
  CultureModal,
} from 'modals';
import { JobsService, UsersService } from 'services';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle, onSiteOptions } from 'constants/globalConstants';
import { TJobSettings } from 'types/employerTypes';
import RequiredSkillsModal from 'modals/required-skills-modal/RequiredSkillsModal';
import { getGeoLocationFromAddress } from 'utils';
import { ViewJobPosting } from 'screens';
import { useBrandFetch, useDidMountEffect, useEmployer, useFormCounter } from 'hooks';
import { extractGoodImageFromBrandFetchData, padToTime } from 'utils/globalUtils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useStyles } from './AddJobStyles';
import BackIcon from '../../../assets/svgs/arrow_left_white.svg';

const blankAddJobState: TJobSettings = {
  title: undefined,
  companyName: undefined,
  companyDescription: undefined,
  jobOverview: undefined,
  address: undefined,
  compensation: undefined,
  img: undefined,
  onSiteSchedule: undefined,
  relevantSkills: undefined,
  requiredYearsOfExperience: undefined,
  jobRequirements: undefined,
  benefits: undefined,
  referralBonus: undefined,
  isPublic: undefined,
};

const blankGeoLocation = {
  type: 'Point',
  coordinates: [-86.7816016, 36.1626638],
};

type AddJobProps = {
  jobColor: string;
  addJobModalVisible: boolean;
  setNewSubmittedJob?: any;
  editJobData?: { jobSettings: typeof blankAddJobState; _id: string | undefined };
  updateJobLocal?: (updatedJobSettings: TJobSettings) => void;
  closeAddJobModal: () => void;
};

const AddJob = ({
  addJobModalVisible,
  jobColor,
  setNewSubmittedJob,
  editJobData,
  updateJobLocal,
  closeAddJobModal,
}: AddJobProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const loggedInUserExpoPushToken = useSelector((state: RootState) => state.loggedInUser.expoPushToken);
  const employerFirstName = useSelector((state: RootState) => state.loggedInUser.firstName);
  const employerLastName = useSelector((state: RootState) => state.loggedInUser.lastName);
  const loggedInUserEmail = useSelector((state: RootState) => state.loggedInUser.email);

  const [addJobState, setAddJobState] = useState(editJobData?.jobSettings || blankAddJobState);
  const [totalCompletedFields, setTotalCompletedFields] = useState(0);
  const [isViewJobPostingModalVisible, setIsViewJobPostingModalVisible] = useState(false);
  const [compensationModalVisible, setCompensationModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [requiredSkillsModalVisible, setRequiredSkillsModalVisible] = useState(false);
  const [benefitsModalVisible, setBenefitsModalVisible] = useState(false);
  const [requirementsModalVisible, setRequirementsModalVisible] = useState(false);
  const [companyDescriptionModalVisible, setCompanyDescriptionModalVisible] = useState(false);
  const [jobOverviewModalVisible, setJobOverviewModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [hasCheckBeenPressed, setHasCheckBeenPressed] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSelectCompanyAlertOpen, setIsSelectCompanyAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hasPressedAddOwnCompanyBrandfetch, setHasPressedAddOwnCompanyBrandfetch] = useState(false);

  const { setSelectedJob } = useEmployer();
  const dispatch = useDispatch();
  const styles = useStyles(jobColor);
  const {
    brandFetchAutoCompleteData,
    isBrandFetchLoading,
    setBrandFetchAutoCompleteData,
    debouncedSearchBrandFetch,
    onSelectCompany,
  } = useBrandFetch();
  const { uncompletedFieldsArray } = useFormCounter(addJobState, hasCheckBeenPressed);

  useEffect(() => {
    let finishedFieldCount = 0;
    Object.values(addJobState).map((value: any) => {
      if (typeof value !== 'undefined') {
        finishedFieldCount++;
      }
    });
    setTotalCompletedFields(finishedFieldCount);
  }, [addJobState]);

  useDidMountEffect(() => {
    if (isAnonymous) {
      onAnonymousCheck();
    } else {
      onAnonymousUnCheck();
    }
  }, [isAnonymous]);

  const onAnonymousCheck = () => {
    updateAddJobState('Keeper Confidential', 'companyName');
    updateAddJobState(
      'The company who is posting this job wants it remain confidential. Match with them and start a conversation to learn the details!',
      'companyDescription',
    );
    updateAddJobState('https://keeper-image-bucket.s3.amazonaws.com/8b3982f6-acda-47b1-8b39-18a402b94dfc.jpeg', 'img');
  };

  const onAnonymousUnCheck = () => {
    updateAddJobState(undefined, 'companyName');
    updateAddJobState(undefined, 'companyDescription');
    updateAddJobState(undefined, 'img');
  };

  // useDidMountEffect(() => {
  //   const currentAddJobState = { ...addJobState };
  //   if (addJobState.onSiteSchedule === 'Remote') {
  //     delete currentAddJobState.address;
  //   } else {
  //     currentAddJobState.address = undefined;
  //   }
  //   setAddJobState(currentAddJobState);
  // }, [addJobState.onSiteSchedule]);

  const resetAddJobState = () => {
    setAddJobState(blankAddJobState);
  };

  const previewJobData: TJob = {
    geoLocation: blankGeoLocation,
    matches: [],
    // need to make modal for user to select relevant skills and required years of experience
    color: jobColor,
    receivedLikes: [],
    createdAt: new Date(),
    lastUpdatedOnWeb: false,
    expoPushToken: loggedInUserExpoPushToken,
    ownerId: loggedInUserId || '',
    ownerEmail: loggedInUserEmail || '',
    publicJobTakenCount: 0,
    publicTakers: [],
    settings: {
      title: addJobState.title || 'Job Title',
      companyName: addJobState.companyName || 'Company Name',
      companyDescription:
        addJobState.companyDescription ||
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
          laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      jobOverview:
        addJobState.jobOverview ||
        `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut 
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
         laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      address: addJobState.address || 'City, State',
      onSiteSchedule: addJobState.onSiteSchedule || 'Remote',
      benefits: addJobState.benefits || ['Benefit', 'Benefit', 'Benefit'],
      relevantSkills: addJobState.relevantSkills || ['Example skill', 'Example skill', 'Example skill'],
      compensation: addJobState.compensation || { type: 'Salary', payRange: { min: 60000, max: 100000 } },
      requiredYearsOfExperience: addJobState.requiredYearsOfExperience || 10,
      jobRequirements: addJobState.jobRequirements || [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore',
      ],
      img: addJobState.img || '',
      referralBonus: 0,
      isPublic: false,
    },
    preferences: {
      searchRadius: 50,
      relevantSkills: addJobState.relevantSkills || [],
      yearsOfExperience: 1,
      isRemote: addJobState.onSiteSchedule === 'Remote',
      geoLocation: blankGeoLocation,
    },
  };

  const updateJob = async () => {
    if (uncompletedFieldsArray.length > 0) {
      setIsBottomSheetOpen(true);
      setHasCheckBeenPressed(true);
      return;
    }
    // editJobData will always have an _id field, were just doing this to satisfy typescript
    if (editJobData?._id) {
      // TODO- make it so if only address has changed then get new geoLocation
      // for example = only if addJobState.address != jobPreferencesRedux.address
      // const newGeoLocation = await getGeoLocationFromAddress(addJobState.address || '');

      try {
        const updateObject = {
          userId: editJobData?._id,
          accountType,
          lastUpdatedOnWeb: false,
          newSettings: addJobState,
        };

        setIsLoading(true);

        // update jobSettings
        // in DB
        const updateUserResponse = await UsersService.updateUserSettings(updateObject);
        dispatch(updateEmployersJob({ jobId: editJobData?._id, updateJobObject: updateUserResponse.userData }));
        // in redux for employersJobs array
        dispatch(updateEmployerJobSettingsRedux(updateObject));

        if (updateJobLocal) {
          updateJobLocal(updateObject.newSettings);
        }
        // Toast.show({
        //   type: 'success',
        //   text1: 'Job updated successfully!',
        //   position: 'bottom',
        // });
        localCloseAddJobModal();
        setDataHasChanged(false);
        resetAddJobState();
        setIsLoading(false);
      } catch (error) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Job update failed, try again later.',
        //   position: 'bottom',
        // });
      }
      setIsLoading(false);
    }
  };

  const postJob = async () => {
    if (uncompletedFieldsArray.length > 0) {
      setIsBottomSheetOpen(true);
      setHasCheckBeenPressed(true);
      return;
    }
    localCloseAddJobModal();

    setIsViewJobPostingModalVisible(false);

    // blank/default geoLocation
    let newGeoLocation = {
      type: 'Point',
      coordinates: [1, 2],
    };

    if (addJobState.address) {
      newGeoLocation = await getGeoLocationFromAddress(addJobState.address);
    }

    const newJob: TJob = {
      geoLocation: newGeoLocation,
      createdAt: new Date(),
      lastUpdatedOnWeb: false,
      matches: [],
      ownerId: loggedInUserId || '',
      ownerEmail: loggedInUserEmail || '',
      color: jobColor || '#A0E0BF',
      receivedLikes: [],
      expoPushToken: loggedInUserExpoPushToken || 'empty',
      publicJobTakenCount: 0,
      publicTakers: [],
      settings: {
        title: addJobState.title,
        companyName: addJobState.companyName,
        companyDescription: addJobState.companyDescription,
        jobOverview: addJobState.jobOverview,
        address: addJobState.address,
        onSiteSchedule: addJobState.onSiteSchedule,
        benefits: addJobState.benefits,
        relevantSkills: addJobState.relevantSkills,
        compensation: addJobState.compensation,
        requiredYearsOfExperience: addJobState.requiredYearsOfExperience,
        jobRequirements: addJobState.jobRequirements,
        img: addJobState.img,
        referralBonus: 0,
        isPublic: false,
      },
      preferences: {
        searchRadius: 50,
        relevantSkills: addJobState.relevantSkills || [],
        yearsOfExperience: addJobState.requiredYearsOfExperience,
        isRemote: addJobState.onSiteSchedule === 'Remote',
        geoLocation: {
          type: 'Point',
          coordinates: [-86.7816016, 36.1626638],
        },
        frontendBackendOptionsOpenTo: ['Only Frontend', 'Full Stack', 'Only Backend'],
        companySizeOptionsOpenTo: ['Startup', 'Mid-Size', 'Large'],
        employmentTypeOptionsOpenTo: ['Salary', 'Contract'],
        workAuthOptionsOpenTo: ['Authorized'],
      },
    };

    // this starts the color fill animation on job board
    setNewSubmittedJob(newJob);
    try {
      if (isEmployerNew) {
        dispatch(addLoggedInUser({ isNew: false }));
        UsersService.updateUserData({ userId: loggedInUserId || '', accountType, updateObject: { isNew: false } });
      }
    } catch (err) {
      console.error(err);
    }

    const addJobPromise = JobsService.addJob({ newJobData: newJob });

    try {
      const addJobResponse: any = await padToTime(addJobPromise, 2000);

      setNewSubmittedJob(null);
      dispatch(addEmployersJobs(addJobResponse[0]));
      resetAddJobState();
      setSelectedJob(addJobResponse[0]);
    } catch (error) {
      setNewSubmittedJob(null);
      resetAddJobState();

      console.error(error);
    }

    // Toast.show({
    //   type: 'success',
    //   text1: 'Job added successfully!',
    //   position: 'bottom',
    // });
  };

  const updateAddJobState = useCallback((value: any, field: string) => {
    setDataHasChanged(true);

    setAddJobState((prevState: any) => {
      return { ...prevState, [field]: value };
    });
  }, []);

  const localCloseAddJobModal = useCallback(() => {
    setDataHasChanged(false);
    closeAddJobModal();
  }, [closeAddJobModal]);

  const onBackPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      localCloseAddJobModal();
    }
  }, [localCloseAddJobModal, dataHasChanged]);

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const returnErrorStyles = useCallback(
    (field: string) => {
      if (hasCheckBeenPressed && uncompletedFieldsArray.includes(field)) {
        return styles.error;
      }
    },
    [hasCheckBeenPressed, styles.error, uncompletedFieldsArray],
  );

  const onAutoCompleteChange = (text: string) => {
    updateAddJobState(text, 'companyName');
    setIsAnonymous(false);
    if (!hasPressedAddOwnCompanyBrandfetch && text != 'Keeper Confidential' && text != 'Keeper Confidentia' && text) {
      debouncedSearchBrandFetch(text);
    }
  };

  const onAddNewCompanyAutoComplete = () => {
    setBrandFetchAutoCompleteData([]);
    setHasPressedAddOwnCompanyBrandfetch(true);
  };

  const onSelectAutoCompleteItem = async (selectedItem: any) => {
    try {
      Keyboard.dismiss();
      const brandFetchRes = await onSelectCompany(selectedItem.brandId);
      const companyImg = extractGoodImageFromBrandFetchData(brandFetchRes);

      updateAddJobState(selectedItem.name, 'companyName');
      updateAddJobState(companyImg, 'img');
      updateAddJobState(brandFetchRes.description, 'companyDescription');

      setBrandFetchAutoCompleteData([]);
    } catch (error) {
      setIsSelectCompanyAlertOpen(true);
      console.error(error);
    }
  };

  const closeSelectCompanyAlert = async () => {
    setIsSelectCompanyAlertOpen(false);
  };

  return (
    <Modal animationType='slide' visible={addJobModalVisible}>
      {/* <Toast ref={ref => Toast.setRef(ref)} /> */}
      <KeeperSpinnerOverlay isLoading={isLoading || isBrandFetchLoading} color='white' />
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} rowNumber={1}>
        <AppHeaderText style={styles.bottomSheetText}>Complete All Fields Before Saving!</AppHeaderText>
        {/* {uncompletedFieldsArray.map((field, index) => (
          <AppText key={index}>{field}</AppText>
        ))} */}
      </BottomSheet>

      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={localCloseAddJobModal}
      />

      <AlertModal
        isOpen={isSelectCompanyAlertOpen}
        title='Please select another option.'
        closeModal={closeSelectCompanyAlert}
        isOkButton
      />

      <LargeDescriptionModal
        text={addJobState.companyDescription || ''}
        setText={(value: string) => updateAddJobState(value, 'companyDescription')}
        isVisible={companyDescriptionModalVisible}
        setIsVisible={setCompanyDescriptionModalVisible}
        title='The Company'
      />
      <LargeDescriptionModal
        text={addJobState.jobOverview || ''}
        setText={(value: string) => updateAddJobState(value, 'jobOverview')}
        isVisible={jobOverviewModalVisible}
        setIsVisible={setJobOverviewModalVisible}
        title='The Role'
      />
      <ExperienceModal
        experience={addJobState.requiredYearsOfExperience}
        setExperience={(value: any) => updateAddJobState(value, 'requiredYearsOfExperience')}
        experienceModalVisible={experienceModalVisible}
        setExperienceModalVisible={setExperienceModalVisible}
      />
      <BenefitsModal
        benefits={addJobState.benefits || []}
        setBenefits={value => updateAddJobState(value, 'benefits')}
        benefitsModalVisible={benefitsModalVisible}
        setBenefitsModalVisible={setBenefitsModalVisible}
      />
      <RequiredSkillsModal
        requiredSkills={addJobState.relevantSkills || []}
        setRequiredSkills={value => updateAddJobState(value, 'relevantSkills')}
        requiredSkillsModalVisible={requiredSkillsModalVisible}
        setRequiredSkillsModalVisible={setRequiredSkillsModalVisible}
      />
      <LocationModal
        address={addJobState.address || ''}
        setAddress={value => updateAddJobState(value, 'address')}
        jobColor={jobColor}
        locationModalVisible={locationModalVisible}
        setLocationModalVisible={setLocationModalVisible}
        searchRadius={addJobState?.searchRadius || 50}
        updateState={updateAddJobState}
        onSiteSchedule={addJobState.onSiteSchedule}
      />
      <ResponsibilitiesModal2
        responsibilities={addJobState.jobRequirements || []}
        setResponsibilities={value => updateAddJobState(value, 'jobRequirements')}
        responsibilitiesModalVisible={requirementsModalVisible}
        setResponsibilitiesModalVisible={setRequirementsModalVisible}
        // headerText={`YOU'RE A FIT IF...`}
      />
      <Compensation
        jobColor={jobColor}
        compensation={
          addJobState.compensation
            ? addJobState.compensation
            : {
                type: 'Salary',
                payRange: { min: 60000, max: 100000 },
              }
        }
        setCompensation={value => updateAddJobState(value, 'compensation')}
        compensationModalVisible={compensationModalVisible}
        setCompensationModalVisible={setCompensationModalVisible}
      />
      <PreviewJobModal isViewJobPostingModalVisible={isViewJobPostingModalVisible}>
        <ViewJobPosting
          previewJobData={previewJobData}
          closeJobPreviewModal={() => setIsViewJobPostingModalVisible(false)}
          noEdit
          // minus 2 because isPublic, and referralBonus do not need to be filled out here
          isJobComplete={totalCompletedFields >= Object.keys(addJobState).length - 2}
          postJob={postJob}
        />
      </PreviewJobModal>
      <View style={styles.addJobSection}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps={false}>
          <RedesignHeader
            title={editJobData ? 'EDIT JOB' : ' ADD JOB'}
            containerStyles={styles.noBottomBorder}
            rightContents={{ icon: 'check', action: editJobData ? updateJob : postJob }}>
            <BackButton goBackAction={onBackPress} />
          </RedesignHeader>
          {/* <View style={styles.jobBoardHeader}>
            <View style={styles.headerLeftSection}>
              <TouchableOpacity style={styles.leftIconTouchable} onPress={closeAddJobModal}>
                <Icon size={40} name='chevron-left' style={styles.backIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.headerMiddleSection}>
              <AppBoldText style={styles.jobBoardHeaderText}>ADD JOB</AppBoldText>
            </View>
            <View style={styles.headerRightSection}></View>
          </View> */}
          <EditProfileTitle text='Company Name' textStyles={returnErrorStyles('companyName')} />
          <BrandFetchAutocomplete
            onChange={onAutoCompleteChange}
            value={addJobState.companyName || ''}
            brandFetchAutoCompleteData={brandFetchAutoCompleteData || []}
            onSelectItem={onSelectAutoCompleteItem}
            onAddNewCompanyAutoComplete={onAddNewCompanyAutoComplete}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
          />

          <EditProfileTitle text='Job Title' textStyles={returnErrorStyles('title')} />
          <EditProfileTextInput value={addJobState.title} stateKeyName='title' onChangeText={updateAddJobState} />

          <LogoModal
            logo={addJobState.img}
            setLogo={value => updateAddJobState(value, 'img')}
            isEmployee={false}
            isError={hasCheckBeenPressed && !addJobState.img}
          />

          <EditProfileTitle text='Work Setting' textStyles={returnErrorStyles('onSiteSchedule')} />
          <View style={styles.workSettingsButtonsContainer}>
            {onSiteOptions.map((option: string, index: number) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={value => updateAddJobState(value, 'onSiteSchedule')}
                  title={option}
                  selected={addJobState.onSiteSchedule === option}
                  selectedButtonStyles={styles.selectedButtonStyles}
                  unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.workSettingButtons}
                  textStyles={styles.workSettingButtonText}
                  unSelectedTextStyles={styles.unSelectedTextStyles}
                />
              );
            })}
          </View>

          <OpenModalItem
            onPress={() => setLocationModalVisible(true)}
            title='Company Location'
            values={addJobState.address}
            titleStyles={returnErrorStyles('address')}
          />

          <OpenModalItem
            onPress={() => setRequiredSkillsModalVisible(true)}
            title='Skills'
            values={addJobState.relevantSkills}
            titleStyles={returnErrorStyles('relevantSkills')}
          />

          <OpenModalItem
            onPress={() => setBenefitsModalVisible(true)}
            title='Benefits'
            containerStyles={styles.noBottomBorder}
            values={addJobState.benefits}
            titleStyles={returnErrorStyles('benefits')}
          />

          <EditProfileTitle text='The Company' textStyles={returnErrorStyles('companyDescription')} />
          <LargeDescriptionBubble
            bubbleText={addJobState.companyDescription}
            openEditModal={setCompanyDescriptionModalVisible}
            placeholderText='Sell the business! Tell us about the company and what they do.'
          />

          <EditProfileTitle text='The Role' textStyles={returnErrorStyles('jobOverview')} />
          <LargeDescriptionBubble
            bubbleText={addJobState.jobOverview}
            openEditModal={setJobOverviewModalVisible}
            placeholderText='What should the employee expect to do in this role?'
          />

          <OpenModalItem
            onPress={() => setExperienceModalVisible(true)}
            title='Required Years of Experience'
            values={addJobState.requiredYearsOfExperience}
            titleStyles={returnErrorStyles('requiredYearsOfExperience')}
          />

          <OpenModalItem
            onPress={() => setCompensationModalVisible(true)}
            title='Compensation'
            values={addJobState.compensation}
            titleStyles={returnErrorStyles('compensation')}
          />
          {/* <OpenModalItem
            onPress={() => setEducationModalVisible(true)}
            containerStyles={[styles.companyInfoButton, styles.borderBottom]}
            textStyles={styles.buttonTextColor}
            title='Education Required'
            values={addJobState.education}
          /> */}

          <OpenModalItem
            onPress={() => setRequirementsModalVisible(true)}
            containerStyles={styles.noBottomBorder}
            title={`You're a Fit if...`}
            values={addJobState.jobRequirements}
            titleStyles={returnErrorStyles('jobRequirements')}
          />

          {!editJobData && (
            <KeeperSelectButton
              onPress={() => setIsViewJobPostingModalVisible(true)}
              title='Preview Job'
              buttonStyles={styles.previewJobButton}
              textStyles={styles.previewJobText}
              isAppHeaderText
            />
          )}
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};

export default AddJob;
