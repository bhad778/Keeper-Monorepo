import { KeeperSelectButton, KeeperSlider, SubHeaderLarge } from 'components';
import { useCallback, useEffect, useState } from 'react';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import {
  TCompanySize,
  TFrontendBackendOptions,
  TEmployerFilterListOptions,
  EmploymentTypes,
  TWorkAuthOptions,
} from 'keeperTypes';
import {
  companySizeOptions,
  employmentTypeOptions,
  frontendBackendOptions,
  workAuthOptions,
} from 'constants/globalConstants';

import useStyles from './ModalFilterContentStyles';

type LocalStateObject = {
  localYearsOfExperience: number;
  localFrontendBackendSelections?: TFrontendBackendOptions[];
  localCompanySizeSelections?: TCompanySize[];
  localEmploymentTypeSelections?: EmploymentTypes[];
  localWorkAuthSelections?: TWorkAuthOptions[];
  localSkills?: string[];
};

type ModalFilterContentProps = {
  selectedFilter: TEmployerFilterListOptions | undefined;
  applyFilters: (localStateObject: LocalStateObject) => void;
};

// this works as such- when you open this BottomSheet, it calls setLocalPreferencesToReduxData(), which
// takes the preferences in redux and sets them in local state. Then, when the user interacts and selects/unselects
// new things then it just changes it in local state. But then when the user closes the BottomSheet it calls
// saveLocalValuesInRedux() to set the local state into redux. Then it also calls saveLocalValuesInDB() and getNewSwipingData()
// which saves the local state in DB and gets new swiping data and also shows spinner by calling dispatch(setIsGetDataForSwipingLoading(true))
// to make sure your local changes are saved just make sure in returnEmployeePreferencesObject or returnSelectedJobPreferencesObject
// is using the local state to create the new preferencesObject which is used in saveLocalValuesInRedux() and saveLocalValuesInDB()
const ModalFilterContent = ({ selectedFilter, applyFilters }: ModalFilterContentProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const selectedJobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);

  const [localYearsOfExperience, setLocalYearsOfExperience] = useState(0);
  const [localCompanySizeSelections, setLocalCompanySizeSelections] = useState<TCompanySize[]>([]);
  const [localFrontendBackendSelections, setLocalFrontendBackendSelections] = useState<TFrontendBackendOptions[]>([]);
  const [localEmploymentTypeSelections, setLocalEmploymentTypeSelections] = useState<EmploymentTypes[]>([]);
  const [localWorkAuthSelections, setLocalWorkAuthSelections] = useState<TWorkAuthOptions[]>([]);

  const styles = useStyles();

  const isEmployee = accountType === 'employee';

  useEffect(() => {
    // every time the bottomSheet is opened we sync our local state with redux state,
    // TODO make a syncLocalPreferencesStateWithRedux function
    // TODO make the skills and other filter UIs
    if (selectedFilter) {
      setLocalPreferencesToReduxData();
    }
  }, [
    employeePreferences.requiredYearsOfExperience,
    isEmployee,
    selectedFilter,
    selectedJobPreferences.yearsOfExperience,
  ]);

  const setLocalPreferencesToReduxData = useCallback(async () => {
    if (isEmployee) {
      setLocalYearsOfExperience(employeePreferences.requiredYearsOfExperience);
    } else {
      setLocalYearsOfExperience(selectedJobPreferences.yearsOfExperience || 0);
      setLocalCompanySizeSelections(selectedJobPreferences.companySizeOptionsOpenTo || []);
      setLocalFrontendBackendSelections(selectedJobPreferences.frontendBackendOptionsOpenTo || []);
      setLocalEmploymentTypeSelections(selectedJobPreferences.employmentTypeOptionsOpenTo || []);
      setLocalWorkAuthSelections(selectedJobPreferences.workAuthOptionsOpenTo || []);
    }
  }, [
    employeePreferences.requiredYearsOfExperience,
    isEmployee,
    selectedJobPreferences.companySizeOptionsOpenTo,
    selectedJobPreferences.employmentTypeOptionsOpenTo,
    selectedJobPreferences.frontendBackendOptionsOpenTo,
    selectedJobPreferences.workAuthOptionsOpenTo,
    selectedJobPreferences.yearsOfExperience,
  ]);

  const updateLocalState = useCallback((updateFunction: (newValue: any) => void, newValue: any) => {
    updateFunction(newValue);
  }, []);

  const onClickMultiButtonOption = useCallback(
    (newSelection: any, localState: any, setLocalState: (newValue: any) => void) => {
      let tempArray = [...localState];
      if (localState.includes(newSelection)) {
        tempArray = tempArray.filter(e => e !== newSelection);
      } else {
        tempArray.push(newSelection);
      }
      setLocalState(tempArray);
    },
    [],
  );

  const returnBaseUi = () => {
    switch (selectedFilter) {
      case 'Experience':
        return (
          <div style={styles.container}>
            <SubHeaderLarge text='Years of Dev Experience' textInputLabelStyle={styles.titleText} />
            <KeeperSlider
              // valueStyles={styles.text}
              minimumValue={0}
              maximumValue={20}
              step={1}
              defaultValue={localYearsOfExperience}
              onSliderComplete={newValue => updateLocalState(setLocalYearsOfExperience, newValue)}
            />
          </div>
        );
      case 'Company Size':
        return (
          <div style={styles.container}>
            <SubHeaderLarge
              text='The size company the candidate is looking for. Select one or multiple.'
              textInputLabelStyle={styles.titleText}
            />
            <div style={styles.buttonsContainer}>
              {companySizeOptions.map((option: TCompanySize, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onClick={newValue =>
                      onClickMultiButtonOption(newValue, localCompanySizeSelections, setLocalCompanySizeSelections)
                    }
                    title={option}
                    selected={localCompanySizeSelections?.includes(option)}
                    buttonStyles={styles.threeButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </div>
          </div>
        );
      case 'Frontend/Backend':
        return (
          <div style={styles.container}>
            <SubHeaderLarge
              text='Stack preference of candidates. Select one or multiple.'
              textInputLabelStyle={styles.titleText}
            />
            <div style={styles.buttonsContainer}>
              {frontendBackendOptions.map((option: TFrontendBackendOptions, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onClick={newValue =>
                      onClickMultiButtonOption(
                        newValue,
                        localFrontendBackendSelections,
                        setLocalFrontendBackendSelections,
                      )
                    }
                    title={option}
                    selected={localFrontendBackendSelections.includes(option)}
                    buttonStyles={styles.threeButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </div>
          </div>
        );
      case 'Work Auth':
        return (
          <div style={styles.container}>
            <SubHeaderLarge
              text='US work authorization of candidate.  Select one or multiple.'
              textInputLabelStyle={styles.titleText}
            />
            <div style={styles.buttonsContainer}>
              {workAuthOptions.map((option: TWorkAuthOptions, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onClick={newValue =>
                      onClickMultiButtonOption(newValue, localWorkAuthSelections, setLocalWorkAuthSelections)
                    }
                    title={option}
                    selected={localWorkAuthSelections.includes(option)}
                    buttonStyles={styles.twoButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </div>
          </div>
        );
      case 'Salary/Contract':
        return (
          <div style={styles.container}>
            <SubHeaderLarge
              text='Employment type preference of candidate. Select one or multiple.'
              textInputLabelStyle={styles.titleText}
            />
            <div style={styles.buttonsContainer}>
              {employmentTypeOptions.map((option: EmploymentTypes, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onClick={newValue =>
                      onClickMultiButtonOption(
                        newValue,
                        localEmploymentTypeSelections,
                        setLocalEmploymentTypeSelections,
                      )
                    }
                    title={option}
                    selected={localEmploymentTypeSelections.includes(option)}
                    buttonStyles={styles.threeButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <>
      {returnBaseUi()}
      <KeeperSelectButton
        buttonStyles={styles.keepButtonLike}
        textStyles={styles.keepButtonTextLike}
        onClick={() =>
          applyFilters({
            localYearsOfExperience,
            localCompanySizeSelections,
            localSkills: selectedJobPreferences.relevantSkills,
            localFrontendBackendSelections,
            localEmploymentTypeSelections,
            localWorkAuthSelections,
          })
        }
        title='Apply Filters'
      />
    </>
  );
};

export default ModalFilterContent;
