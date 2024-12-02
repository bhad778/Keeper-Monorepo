import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { JobsService, UsersService } from 'services';
import { AppText, AppHeaderText, KeeperSpinnerOverlay } from 'components';
import { RootState, setSwipingDataRedux, setEmployeePreferencesRedux } from 'reduxStore';
import { numberWithCommas } from 'utils';
import { ExperienceModal, EmployeeCompensationModal, RequiredSkillsModal } from 'modals';
import { TEmployeePreferences } from 'types/employeeTypes';

import { useStyles } from './EmployeePreferencesModalStyles';
import getEnvVars from '../../../environment';

type EmployeePreferencesModalProps = {
  isEmployeePreferencesModalVisible: boolean;
  setIsEmployeePreferencesModalVisible: any;
};

const EmployeePreferencesModal = ({
  isEmployeePreferencesModalVisible,
  setIsEmployeePreferencesModalVisible,
}: EmployeePreferencesModalProps) => {
  const employeePreferencesRedux = useSelector((state: RootState) => state.loggedInUser.preferences);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const { googleMapsApiKey } = getEnvVars();
  const dispatch = useDispatch();
  const styles = useStyles();

  const [employeePreferences, setEmployeePreferences] = useState(employeePreferencesRedux);

  const [preferencesHaveChanged, setPreferencesHaveChanged] = useState(false);
  const [isPreferenceUpdateLoading, setIsPreferenceUpdateLoading] = useState(false);

  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [compensationModalVisible, setCompensationModalVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  const updateEmployeePreferencesState = (value: any, field: string) => {
    setPreferencesHaveChanged(true);
    setEmployeePreferences((prevState: any) => {
      return { ...prevState, [field]: value };
    });
  };

  // if they open modal and change stuff, but then press close instead of save, their changes are not saved
  const resetLocalStateToRedux = useCallback(() => {
    setEmployeePreferences(employeePreferences);
  }, [employeePreferences]);

  useEffect(() => {
    resetLocalStateToRedux();
  }, [resetLocalStateToRedux, employeePreferences]);

  const closeModal = () => {
    setPreferencesHaveChanged(false);
    resetLocalStateToRedux();
    setIsEmployeePreferencesModalVisible(false);
  };

  const savePreferences = async () => {
    setIsPreferenceUpdateLoading(true);
    const uriEncodedAddress = encodeURIComponent(employeePreferences.address || '');
    try {
      const googleMapsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${uriEncodedAddress}&key=${googleMapsApiKey}`,
      );
      const newGeoLocation = {
        type: 'Point',
        coordinates: [
          googleMapsResponse?.data?.results[0]?.geometry?.location.lng,
          googleMapsResponse?.data?.results[0]?.geometry?.location.lat,
        ],
      };
      const preferencesObject: TEmployeePreferences = {
        searchRadius: employeePreferences.searchRadius,
        requiredYearsOfExperience: employeePreferences.requiredYearsOfExperience,
        // requiredEducation: employeePreferences.requiredEducation,
        address: employeePreferences.address,
        geoLocation: newGeoLocation,
        compensation: employeePreferences.compensation,
        relevantSkills: employeePreferences.relevantSkills,
        isRemote: true,
        // isRemote: employeePreferences.isRemote,
        isNew: employeePreferences.isNew,
      };

      try {
        UsersService.updateEmployeePreferences({
          userId: loggedInUserId,
          preferencesObject,
        });
      } catch (err) {
        console.error(err);
      }

      try {
        const getJobsForSwiping = await JobsService.getJobsForSwiping({
          userId: loggedInUserId,
          preferences: preferencesObject,
        });
        dispatch(setSwipingDataRedux(getJobsForSwiping));
      } catch (err) {
        console.error(err);
      }
      dispatch(setEmployeePreferencesRedux(preferencesObject));

      setPreferencesHaveChanged(false);
      setIsEmployeePreferencesModalVisible(false);
    } catch (error) {
      console.error(error);
    }
    setIsPreferenceUpdateLoading(false);
  };

  const showEducationText = useCallback((education: string) => {
    if (education === 'None') {
      return education;
    } else {
      return `At least a ${education}`;
    }
  }, []);

  const showCompensationText = () => {
    if (
      employeePreferences.compensation.typesOpenTo.includes('Contract') &&
      employeePreferences.compensation.typesOpenTo.includes('Salary')
    ) {
      return `Pays around $${numberWithCommas(
        employeePreferences.compensation?.targetHourly,
      )} per hour or $${numberWithCommas(employeePreferences.compensation?.targetSalary)} annually`;
    } else {
      return employeePreferences.compensation.typesOpenTo.includes('Contract')
        ? `Pays around $${numberWithCommas(employeePreferences.compensation?.targetHourly)} per hour`
        : `Pays around $${numberWithCommas(employeePreferences.compensation?.targetSalary)} annually`;
    }
  };

  return (
    <Modal animationType='slide' visible={isEmployeePreferencesModalVisible}>
      <KeeperSpinnerOverlay isLoading={isPreferenceUpdateLoading} />

      <View style={styles.preferenceModalContainer}>
        <View style={styles.header}>
          <View style={styles.headerPill}>
            <View style={styles.leftSection}>{<MaterialIcon onPress={closeModal} name='close' size={30} />}</View>
            <View style={styles.titleSection}>
              <AppHeaderText style={styles.titleText}>What kind of jobs do you want to see?</AppHeaderText>
            </View>
            <View style={styles.rightSection}>
              {preferencesHaveChanged && <MaterialIcon onPress={savePreferences} name='done' size={30} />}
            </View>
          </View>
        </View>
        <View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* <TouchableOpacity style={styles.preferenceItem} onPress={() => setLocationModalVisible(true)}>
              <AppHeaderText>Location</AppHeaderText>
              <AppText>{employeePreferences.isRemote ? 'Remote' : employeePreferences.address}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setCompensationModalVisible(true)}>
              <AppHeaderText>Target Compensation</AppHeaderText>
              <AppText>{showCompensationText()}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setExperienceModalVisible(true)}>
              <AppHeaderText>Years of Experience</AppHeaderText>
              <AppText>{`At least ${employeePreferences.requiredYearsOfExperience} years experience`}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.preferenceItem} onPress={() => setEducationModalVisible(true)}>
              <AppHeaderText>Education</AppHeaderText>
              <AppText>{showEducationText(employeePreferences.requiredEducation)}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setSkillsModalVisible(true)}>
              <AppHeaderText>Skills</AppHeaderText>
              <AppText numberOfLines={1} style={{ width: '90%' }}>
                {employeePreferences.relevantSkills.join(', ')}
              </AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <EmployeeCompensationModal
        compensation={employeePreferences.compensation}
        setCompensation={value => updateEmployeePreferencesState(value, 'compensation')}
        compensationModalVisible={compensationModalVisible}
        setCompensationModalVisible={setCompensationModalVisible}
      />
      <ExperienceModal
        experience={employeePreferences.requiredYearsOfExperience}
        setExperience={(value: any) => updateEmployeePreferencesState(value, 'requiredYearsOfExperience')}
        experienceModalVisible={experienceModalVisible}
        setExperienceModalVisible={setExperienceModalVisible}
      />
      <RequiredSkillsModal
        requiredSkills={employeePreferences.relevantSkills || []}
        setRequiredSkills={(value: any) => updateEmployeePreferencesState(value, 'relevantSkills')}
        requiredSkillsModalVisible={skillsModalVisible}
        setRequiredSkillsModalVisible={setSkillsModalVisible}
      />
    </Modal>
  );
};

export default EmployeePreferencesModal;
