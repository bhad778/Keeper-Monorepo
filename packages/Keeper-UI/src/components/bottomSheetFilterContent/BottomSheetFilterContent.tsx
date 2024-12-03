import { ChipsPickerBottomSheet, EditProfileTitle, KeeperSelectButton, KeeperSlider } from 'components';
import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import {
  TCompanySize,
  TFrontendBackendOptions,
  TEmployerFilterListOptions,
  TWorkAuthOptions,
  EmploymentTypes,
} from 'types';

// import {
//   TCompanySize,
//   TFrontendBackendOptions,
//   TEmployerFilterListOptions,
//   TWorkAuthOptions,
//   EmploymentTypes,
// } from '../../../../../shared/types';

// import { TCompanySize } from '../../shared/types';

import { TechnologiesList } from 'constants/TechnologiesList';
import {
  companySizeOptions,
  employmentTypeOptions,
  frontendBackendOptions,
  workAuthOptions,
} from 'constants/globalConstants';

import useStyles from './BottomSheetFilterContentStyles';

type LocalStateObject = {
  localYearsOfExperience: number;
  localSkills: string[];
  localFrontendBackendSelections?: TFrontendBackendOptions[];
  localCompanySizeSelections?: TCompanySize[];
  localEmploymentTypeSelections?: EmploymentTypes[];
  localWorkAuthSelections?: TWorkAuthOptions[];
};

type BottomSheetFilterContentProps = {
  selectedFilter: TEmployerFilterListOptions;
  applyFilters: (localStateObject: LocalStateObject) => void;
};

// this works as such- when you open this BottomSheet, it calls setLocalPreferencesToReduxData(), which
// takes the preferences in redux and sets them in local state. Then, when the user interacts and selects/unselects
// new things then it just changes it in local state. But then when the user closes the BottomSheet it calls
// saveLocalValuesInRedux() to set the local state into redux. Then it also calls saveLocalValuesInDB() and getNewSwipingData()
// which saves the local state in DB and gets new swiping data and also shows spinner by calling dispatch(setIsGetDataForSwipingLoading(true))
// to make sure your local changes are saved just make sure in returnEmployeePreferencesObject or returnSelectedJobPreferencesObject
// is using the local state to create the new preferencesObject which is used in saveLocalValuesInRedux() and saveLocalValuesInDB()
const BottomSheetFilterContent = ({ selectedFilter, applyFilters }: BottomSheetFilterContentProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const selectedJobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);

  const [localYearsOfExperience, setLocalYearsOfExperience] = useState(0);
  const [localSkills, setLocalSkills] = useState<string[]>([]);
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
      setLocalSkills(employeePreferences.relevantSkills);
    } else {
      setLocalYearsOfExperience(selectedJobPreferences.yearsOfExperience || 0);
      setLocalSkills(selectedJobPreferences.relevantSkills || []);
      setLocalCompanySizeSelections(selectedJobPreferences.companySizeOptionsOpenTo || []);
      setLocalFrontendBackendSelections(selectedJobPreferences.frontendBackendOptionsOpenTo || []);
      setLocalEmploymentTypeSelections(selectedJobPreferences.employmentTypeOptionsOpenTo || []);
      setLocalWorkAuthSelections(selectedJobPreferences.workAuthOptionsOpenTo || []);
    }
  }, [
    employeePreferences.relevantSkills,
    employeePreferences.requiredYearsOfExperience,
    isEmployee,
    selectedJobPreferences.companySizeOptionsOpenTo,
    selectedJobPreferences.employmentTypeOptionsOpenTo,
    selectedJobPreferences.frontendBackendOptionsOpenTo,
    selectedJobPreferences.relevantSkills,
    selectedJobPreferences.workAuthOptionsOpenTo,
    selectedJobPreferences.yearsOfExperience,
  ]);

  const updateLocalState = useCallback((updateFunction: (newValue: any) => void, newValue: any) => {
    updateFunction(newValue);
  }, []);

  const onPressMultiButtonOption = useCallback(
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
          <View style={styles.container}>
            <EditProfileTitle text='Years Of Dev Experience' textStyles={[styles.text, styles.titleText]} />
            <KeeperSlider
              valueStyles={styles.text}
              minimumValue={0}
              maximumValue={20}
              step={1}
              defaultValue={localYearsOfExperience}
              onSliderComplete={newValue => updateLocalState(setLocalYearsOfExperience, newValue)}
            />
          </View>
        );
      case 'Skills':
        return (
          <View style={styles.skillsPickerContainer}>
            <ChipsPickerBottomSheet
              chipsData={TechnologiesList}
              selectedChips={localSkills}
              setSelectedChips={newValue => updateLocalState(setLocalSkills, newValue)}
            />
          </View>
        );
      case 'Company Size':
        return (
          <View style={styles.container}>
            <EditProfileTitle
              text='The size company the candidate is looking for. Select one or multiple.'
              textStyles={[styles.text, styles.longTitleText]}
            />
            <View style={styles.buttonsContainer}>
              {companySizeOptions.map((option: TCompanySize, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onPress={newValue =>
                      onPressMultiButtonOption(newValue, localCompanySizeSelections, setLocalCompanySizeSelections)
                    }
                    title={option}
                    selected={localCompanySizeSelections?.includes(option)}
                    buttonStyles={styles.threeButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </View>
          </View>
        );
      case 'Frontend/Backend':
        return (
          <View style={styles.container}>
            <EditProfileTitle
              text='Stack preference of candidates. Select one or multiple.'
              textStyles={[styles.text, styles.longTitleText]}
            />
            <View style={styles.buttonsContainer}>
              {frontendBackendOptions.map((option: TFrontendBackendOptions, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onPress={newValue =>
                      onPressMultiButtonOption(
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
            </View>
          </View>
        );
      case 'Work Auth':
        return (
          <View style={styles.container}>
            <EditProfileTitle
              text='US work authorization of candidate.  Select one or multiple.'
              textStyles={[styles.text, styles.longTitleText]}
            />
            <View style={styles.buttonsContainer}>
              {workAuthOptions.map((option: TWorkAuthOptions, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onPress={newValue =>
                      onPressMultiButtonOption(newValue, localWorkAuthSelections, setLocalWorkAuthSelections)
                    }
                    title={option}
                    selected={localWorkAuthSelections.includes(option)}
                    buttonStyles={styles.twoButton}
                    textStyles={styles.buttonTextStyles}
                  />
                );
              })}
            </View>
          </View>
        );
      case 'Salary/Contract':
        return (
          <View style={styles.container}>
            <EditProfileTitle
              text='Employment type preference of candidate. Select one or multiple.'
              textStyles={[styles.text, styles.longTitleText]}
            />
            <View style={styles.buttonsContainer}>
              {employmentTypeOptions.map((option: EmploymentTypes, index: number) => {
                return (
                  <KeeperSelectButton
                    key={index}
                    onPress={newValue =>
                      onPressMultiButtonOption(
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
            </View>
          </View>
        );
    }
  };

  return (
    <>
      {returnBaseUi()}
      <KeeperSelectButton
        buttonStyles={styles.keepButtonLike}
        textStyles={styles.keepButtonTextLike}
        onPress={() =>
          applyFilters({
            localYearsOfExperience,
            localSkills,
            localCompanySizeSelections,
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

export default BottomSheetFilterContent;
