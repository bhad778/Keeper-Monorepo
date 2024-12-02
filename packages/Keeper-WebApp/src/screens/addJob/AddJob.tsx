import { useCallback, useState } from 'react';
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
  AlertModal,
  AppBoldText,
  AppHeaderText,
  BackButton,
  BannerWhite,
  Header,
  JobPostingComponent,
  KeeperAutoComplete,
  KeeperModal,
  KeeperSelectButton,
  KeeperTextInput,
  LargeDescriptionModal,
  OpenModalItem,
  SectionContainer,
  SpinnerOverlay,
  SubHeaderLarge,
} from 'components';
import {
  BenefitsModal,
  ExperienceModal,
  LocationModal,
  ResponsibilitiesModal,
  Compensation,
  LogoModal,
  RequiredSkillsModal,
} from 'modals';
import { JobsService, UsersService } from 'services';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle, onSiteOptions } from 'constants/globalConstants';
import { TJobSettings } from 'types/employerTypes';
import { getGeoLocationFromAddress } from 'utils';
import { useBrandFetch, useDidMountEffect, useEmployer, useFormCounter } from 'hooks';
import Grid from '@mui/material/Grid';
import { extractGoodImageFromBrandFetchData, padToTime } from 'utils/globalUtils';
import toast from 'react-hot-toast';

import { useStyles } from './AddJobStyles';

const blankGeoLocation = {
  type: 'Point',
  coordinates: [-86.7816016, 36.1626638],
};

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

type AddJobProps = {
  jobColor: string;
  cameFromPreviewPress?: boolean;
  setNewSubmittedJob?: any;
  editJobData?: {
    jobSettings: typeof blankAddJobState | undefined;
    _id: string | undefined;
  };
  updateJobLocal?: (updatedJobSettings: TJobSettings) => void;
  closeModal: () => void;
};

const AddJob = ({
  jobColor,
  cameFromPreviewPress,
  setNewSubmittedJob,
  editJobData,
  updateJobLocal,
  closeModal,
}: AddJobProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const loggedInUserExpoPushToken = useSelector((state: RootState) => state.loggedInUser.expoPushToken);
  const loggedInUserEmail = useSelector((state: RootState) => state.loggedInUser.email);

  const [isLoading, setIsLoading] = useState(false);
  const [addJobState, setAddJobState] = useState(editJobData?.jobSettings || blankAddJobState);
  const [compensationModalVisible, setCompensationModalVisible] = useState(false);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [requiredSkillsModalVisible, setRequiredSkillsModalVisible] = useState(false);
  const [benefitsModalVisible, setBenefitsModalVisible] = useState(false);
  const [requirementsModalVisible, setRequirementsModalVisible] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [hasCheckBeenPressed, setHasCheckBeenPressed] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(cameFromPreviewPress);
  const [hasPressedAddOwnCompanyBrandfetch, setHasPressedAddOwnCompanyBrandfetch] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(!!isPreviewMode);
  const { setSelectedJob } = useEmployer();
  const {
    brandFetchAutoCompleteData,
    isBrandFetchLoading,
    setBrandFetchAutoCompleteData,
    debouncedSearchBrandFetch,
    onSelectCompany,
  } = useBrandFetch();
  const { uncompletedFieldsArray } = useFormCounter(addJobState, hasCheckBeenPressed);

  const isNewJob = !editJobData?._id;

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
      'companyDescription'
    );
    updateAddJobState('https://keeper-image-bucket.s3.amazonaws.com/8b3982f6-acda-47b1-8b39-18a402b94dfc.jpeg', 'img');
  };

  const onAnonymousUnCheck = () => {
    updateAddJobState(undefined, 'companyName');
    updateAddJobState(undefined, 'companyDescription');
    updateAddJobState(undefined, 'img');
  };

  const resetAddJobState = () => {
    setAddJobState(blankAddJobState);
  };

  const updateJob = async () => {
    setIsLoading(true);

    // editJobData will always have an _id field, were just doing this to satisfy typescript
    if (!isNewJob) {
      // TODO- make it so if only address has changed then get new geoLocation
      // for example = only if addJobState.address != jobPreferencesRedux.address
      // const newGeoLocation = await getGeoLocationFromAddress(addJobState.address || '');

      const updateObject = {
        userId: editJobData?._id,
        accountType,
        lastUpdatedOnWeb: true,
        newSettings: addJobState,
      };

      // update jobSettings
      // in DB
      const updateUserResponse = await UsersService.updateUserSettings(updateObject);
      dispatch(
        updateEmployersJob({
          jobId: editJobData?._id,
          updateJobObject: updateUserResponse.userData,
        })
      );
      // in redux for employersJobs array
      dispatch(updateEmployerJobSettingsRedux(updateObject));

      if (updateJobLocal) {
        updateJobLocal(updateObject.newSettings);
      }

      closeAddJobModal();
      setDataHasChanged(false);
      resetAddJobState();
      setIsLoading(false);
    }
  };

  const postJob = async () => {
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
      lastUpdatedOnWeb: true,
      matches: [],
      ownerId: loggedInUserId || '',
      ownerEmail: loggedInUserEmail || '',
      color: jobColor || '#A0E0BF',
      receivedLikes: [],
      expoPushToken: loggedInUserExpoPushToken || 'none',
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
    closeAddJobModal();

    try {
      if (isEmployerNew) {
        dispatch(addLoggedInUser({ isNew: false }));
        UsersService.updateUserData({
          userId: loggedInUserId || '',
          accountType,
          updateObject: { isNew: false },
        });
      }
    } catch (err) {
      console.error(err);
    }
    const addJobPromise = JobsService.addJob({ newJobData: newJob });

    padToTime(addJobPromise, 2000)
      .then((addJobResponse) => {
        // this stops the color fill animation on job board
        setNewSubmittedJob(null);
        dispatch(addEmployersJobs(addJobResponse[0]));
        resetAddJobState();

        setSelectedJob(addJobResponse[0]);
      })
      .catch((err) => {
        console.error(err);
        setNewSubmittedJob(null);
        resetAddJobState();
      });
  };

  const updateAddJobState = useCallback((value: any, field: string) => {
    setDataHasChanged(true);

    setAddJobState((prevState: any) => {
      return { ...prevState, [field]: value };
    });
  }, []);

  const closeAddJobModal = () => {
    closeModal();
    setDataHasChanged(false);
  };

  const onBackClick = () => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  };

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const returnErrorStyles = useCallback(
    (field: string) => {
      if (hasCheckBeenPressed && uncompletedFieldsArray.includes(field)) {
        return styles.error;
      }
    },
    [hasCheckBeenPressed, styles.error, uncompletedFieldsArray]
  );

  // title: undefined,
  // companyName: undefined,
  // companyDescription: undefined,
  // jobOverview: undefined,
  // address: undefined,
  // compensation: undefined,
  // img: undefined,
  // onSiteSchedule: undefined,
  // relevantSkills: undefined,
  // requiredYearsOfExperience: undefined,
  // jobRequirements: undefined,
  // benefits: undefined,
  // referralBonus: undefined,
  // isPublic: undefined,
  // searchRadius: 50,

  const mapUncompletedFieldsToTitles = useCallback((fieldName: string) => {
    switch (fieldName) {
      case 'img':
        return 'Logo Image';
      case 'title':
        return 'Job Title';
      case 'companyName':
        return 'Company Name';
      case 'companyDescription':
        return 'Company Description';
      case 'jobOverview':
        return 'Job Overview';
      case 'address':
        return 'Location';
      case 'benefits':
        return 'Benefits';
      case 'compensation':
        return 'Compensation';
      case 'onSiteSchedule':
        return 'Work Settings';
      case 'relevantSkills':
        return 'Relevant Skills';
      case 'requiredYearsOfExperience':
        return 'Required Years of Experience';
      case 'jobRequirements':
        return `You're a fit if`;
      default:
        return fieldName;
    }
  }, []);

  const returnUncompletedFieldsString = useCallback(
    (uncompletedFieldsArray: string[]) => {
      let finalString = '';
      uncompletedFieldsArray.map((field) => {
        finalString += mapUncompletedFieldsToTitles(field) + ', ';
      });
      // slice -2 to remove the last comma and space
      return finalString.slice(0, -2);
    },
    [mapUncompletedFieldsToTitles]
  );

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const onConfirmAlertModalPress = () => {
    closeAlertModal();
    closeModal();
  };

  const onBackClickWhileInPreviewMode = () => {
    onBackClick(true);
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
      setBrandFetchAutoCompleteData([]);
      const brandFetchRes = await onSelectCompany(selectedItem.brandId);
      const companyImg = extractGoodImageFromBrandFetchData(brandFetchRes);

      updateAddJobState(selectedItem.name, 'companyName');
      updateAddJobState(companyImg, 'img');
      updateAddJobState(brandFetchRes.description, 'companyDescription');
    } catch (error) {
      toast.error('Please select another job');
      console.error(error);
    }
  };

  const onSavePress = () => {
    if (uncompletedFieldsArray.length > 0) {
      setIsBottomSheetOpen(true);
      setHasCheckBeenPressed(true);
      setIsPreviewMode(false);
      return;
    }

    if (isNewJob) {
      postJob();
    } else {
      updateJob();
    }
  };

  const onPreviewPress = () => {
    setIsPreviewMode(true);
  };

  const onBackToEditPress = () => {
    setIsPreviewMode(false);
  };

  const returnTopButtons = () => {
    // if they cameFromPreviewPress than the top should have no buttons
    // and it should just be a back to job board button on left
    if (cameFromPreviewPress) {
      return null;
    }

    if (!isPreviewMode) {
      return (
        <span>
          <KeeperSelectButton
            onClick={onSavePress}
            title={isNewJob ? 'Create Job' : 'Save Changes'}
            buttonStyles={styles.saveJobButton}
            textStyles={styles.saveJobButtonText}
          />
          <KeeperSelectButton
            onClick={onPreviewPress}
            title={'Preview'}
            buttonStyles={styles.previewButton}
            textStyles={styles.saveJobButtonText}
          />
        </span>
      );
    }
  };

  return (
    <Grid container spacing={4} style={styles.addEditJobContainer}>
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={onConfirmAlertModalPress}
      />

      {returnTopButtons()}
      {isPreviewMode ? (
        <JobPostingComponent
          isFromEdit={!cameFromPreviewPress}
          isOwner={true}
          currentJobSettings={previewJobData.settings}
          onBackClick={!cameFromPreviewPress ? onBackToEditPress : onBackClickWhileInPreviewMode}
        />
      ) : (
        <>
          <Grid item sm={12} style={styles.grid1} lg={4} xl={4}>
            {isLoading && <SpinnerOverlay />}

            <KeeperModal isOpen={isBottomSheetOpen} closeModal={closeBottomSheet}>
              <AppHeaderText style={styles.bottomSheetText}>Finish the Following Fields Before Saving!</AppHeaderText>
              <div style={styles.uncompletedFieldsContainer}>
                <AppBoldText style={styles.uncompletedFieldsString}>
                  {returnUncompletedFieldsString(uncompletedFieldsArray)}
                </AppBoldText>
              </div>
            </KeeperModal>

            {experienceModalVisible && (
              <ExperienceModal
                experience={addJobState.requiredYearsOfExperience}
                setExperience={(value: any) => updateAddJobState(value, 'requiredYearsOfExperience')}
                setExperienceModalVisible={setExperienceModalVisible}
              />
            )}

            {benefitsModalVisible && (
              <BenefitsModal
                benefits={addJobState.benefits || []}
                setBenefits={(value) => updateAddJobState(value, 'benefits')}
                setBenefitsModalVisible={setBenefitsModalVisible}
              />
            )}

            {requiredSkillsModalVisible && (
              <RequiredSkillsModal
                requiredSkills={addJobState.relevantSkills || []}
                setRequiredSkills={(value) => updateAddJobState(value, 'relevantSkills')}
                setRequiredSkillsModalVisible={setRequiredSkillsModalVisible}
              />
            )}

            {locationModalVisible && (
              <LocationModal
                address={addJobState.address || ''}
                setAddress={(value) => updateAddJobState(value, 'address')}
                jobColor={jobColor}
                setLocationModalVisible={setLocationModalVisible}
                searchRadius={addJobState?.searchRadius || 50}
                updateState={updateAddJobState}
                onSiteSchedule={addJobState.onSiteSchedule}
              />
            )}

            {requirementsModalVisible && (
              <ResponsibilitiesModal
                responsibilities={addJobState.jobRequirements || []}
                responsibilitiesModalVisible={requirementsModalVisible}
                setResponsibilities={(value) => updateAddJobState(value, 'jobRequirements')}
                setResponsibilitiesModalVisible={setRequirementsModalVisible}
              />
            )}

            {compensationModalVisible && (
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
                setCompensation={(value) => updateAddJobState(value, 'compensation')}
                setCompensationModalVisible={setCompensationModalVisible}
              />
            )}

            <BackButton
              onClick={() => onBackClick()}
              backText="Back to Job Board"
              iconStyles={styles.backButtonIcon}
              containerStyles={styles.backButtonContainer}
            />

            <SectionContainer>
              <SubHeaderLarge
                text="Company Name"
                errorTextStyles={returnErrorStyles('companyName')}
                textInputLabelStyle={styles.companyNameTitle}
                className="companyNameTitle"
              />
              <KeeperAutoComplete
                onChange={onAutoCompleteChange}
                value={addJobState.companyName || ''}
                data={brandFetchAutoCompleteData || []}
                isLoading={isBrandFetchLoading}
                onSelectItem={onSelectAutoCompleteItem}
                onAddNewCompanyAutoComplete={onAddNewCompanyAutoComplete}
                isAnonymous={isAnonymous}
                setIsAnonymous={setIsAnonymous}
              />
              <SubHeaderLarge text="Job Title" errorTextStyles={returnErrorStyles('title')} />
              <KeeperTextInput
                value={addJobState.title}
                errorTextStyles={returnErrorStyles('title')}
                onChange={(value) => updateAddJobState(value, 'title')}
                placeholder="Ex: Senior React Developer"
              />
              <LogoModal
                logo={addJobState.img}
                setLogo={(value) => updateAddJobState(value, 'img')}
                isEmployee={false}
                isError={hasCheckBeenPressed && !addJobState.img}
                isJobPosting
              />
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setCompensationModalVisible(true)}
                title="Compensation"
                isAppText
                values={addJobState.compensation}
                titleStyles={returnErrorStyles('compensation')}
              />
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setBenefitsModalVisible(true)}
                title="Benefits"
                isAppText
                containerStyles={styles.noBottomBorder}
                values={addJobState.benefits}
                titleStyles={returnErrorStyles('benefits')}
              />
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setLocationModalVisible(true)}
                title="Company Location"
                isAppText
                values={addJobState.address}
                containerStyles={{ flexDirection: 'row' }}
                titleStyles={returnErrorStyles('address')}
              />
            </SectionContainer>

            {/* <SectionContainer>
              <Clickable style={styles.saveJobButton} onClick={onSavePress}>
                Save Job
              </Clickable>
            </SectionContainer> */}
          </Grid>
          <Grid style={styles.grid2} item sm={12} lg={8} xl={8}>
            <SectionContainer>
              <Header text="Company Description" errorTextStyles={returnErrorStyles('companyDescription')} />
              <LargeDescriptionModal
                text={addJobState.companyDescription || ''}
                setText={(value: string) => updateAddJobState(value, 'companyDescription')}
                placeholder={`Ex: Splunk is here to build a safer and more resilient digital world. The world's leading enterprises use our unified security and observability platform to keep their digital systems secure and reliable. While customers love our technology, it's our people that make Splunk stand out as an amazing career destination and why we've won so many awards as a best place to work. `}
              />
            </SectionContainer>

            <SectionContainer>
              <Header text="The Role" errorTextStyles={returnErrorStyles('jobOverview')} />
              <LargeDescriptionModal
                text={addJobState.jobOverview || ''}
                setText={(value: string) => updateAddJobState(value, 'jobOverview')}
                placeholder={`Ex: In this role you will focus on building an intuitive data analytics user experience. Your work encompasses the intersection of data, engineering and design, utilizing modern web technologies to help our customers make informed decisions and find answers to their business questions.`}
              />
            </SectionContainer>

            <SectionContainer>
              <Header text="Work Setting" errorTextStyles={returnErrorStyles('onSiteSchedule')} />
              <div style={styles.onSiteScheduleContainer} className="onSiteSchedule">
                {onSiteOptions.map((option: string) => {
                  return (
                    <KeeperSelectButton
                      onClick={(value) => updateAddJobState(value, 'onSiteSchedule')}
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
              </div>
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setExperienceModalVisible(true)}
                title="Required Years of Experience"
                isAppText
                values={addJobState.requiredYearsOfExperience}
                titleStyles={returnErrorStyles('requiredYearsOfExperience')}
              />
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setRequiredSkillsModalVisible(true)}
                title="Skills"
                isAppText
                containerStyles={{ flexDirection: 'row' }}
                values={addJobState.relevantSkills}
                titleStyles={returnErrorStyles('relevantSkills')}
              />
            </SectionContainer>

            <SectionContainer>
              <OpenModalItem
                onClick={() => setRequirementsModalVisible(true)}
                containerStyles={styles.noBottomBorder}
                title={`You're a Fit if...`}
                isAppText
                values={addJobState.jobRequirements}
                titleStyles={returnErrorStyles('jobRequirements')}
              />
            </SectionContainer>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export default AddJob;
