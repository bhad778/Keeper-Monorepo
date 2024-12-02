import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { JobsService, UsersService } from 'services';
import { AppText, AppHeaderText, KeeperSpinnerOverlay } from 'components';
import {
  RootState,
  setSwipingDataRedux,
  setEmployerJobPreferencesRedux,
  setSelectedJobPreferencesRedux,
} from 'reduxStore';
import { numberWithCommas } from 'utils';
import { ExperienceModal, Compensation, RequiredSkillsModal } from 'modals';

import { useStyles } from './JobPreferencesModalStyles';
import getEnvVars from '../../../environment';

type JobPreferencesModalProps = {
  isJobPreferencesModalVisible: boolean;
  setIsJobPreferencesModalVisible: any;
};

const JobPreferencesModal = ({
  isJobPreferencesModalVisible,
  setIsJobPreferencesModalVisible,
}: JobPreferencesModalProps) => {
  const selectedJob = useSelector((state: RootState) => state.local.selectedJob);

  const { googleMapsApiKey } = getEnvVars();
  const dispatch = useDispatch();
  const styles = useStyles();

  const [jobPreferences, setJobPreferences] = useState(selectedJob.preferences);

  const [preferencesHaveChanged, setPreferencesHaveChanged] = useState(false);
  const [isPreferenceUpdateLoading, setIsPreferenceUpdateLoading] = useState(false);

  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [compensationModalVisible, setCompensationModalVisible] = useState(false);
  const [skillsModalVisible, setSkillsModalVisible] = useState(false);

  const updateJobPreferencesState = (value: any, field: string) => {
    setPreferencesHaveChanged(true);
    setJobPreferences((prevState: any) => {
      return { ...prevState, [field]: value };
    });
  };

  // if they open modal and change stuff, but then press close instead of save, their changes are not saved
  const resetLocalStateToRedux = useCallback(() => {
    setJobPreferences(selectedJob.preferences);
  }, [selectedJob.preferences]);

  useEffect(() => {
    resetLocalStateToRedux();
  }, [resetLocalStateToRedux, selectedJob]);

  const closeModal = () => {
    setPreferencesHaveChanged(false);
    resetLocalStateToRedux();
    setIsJobPreferencesModalVisible(false);
  };

  const savePreferences = async () => {
    setIsPreferenceUpdateLoading(true);
    const uriEncodedAddress = encodeURIComponent(jobPreferences.address || '');
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
      const preferencesObject = {
        address: jobPreferences.address,
        geoLocation: newGeoLocation,
        compensation: jobPreferences.compensation,
        // searchRadius: convertMilesToMeters(jobPreferences.searchRadius || 0),
        searchRadius: jobPreferences.searchRadius,
        yearsOfExperience: jobPreferences.yearsOfExperience,
        education: jobPreferences.education,
        relevantSkills: jobPreferences.relevantSkills,
        isRemote: true,
        // isRemote: jobPreferences.isRemote,
      };

      try {
        JobsService.updateJobPreferences({
          jobId: selectedJob._id,
          preferences: preferencesObject,
        });
      } catch (err) {
        console.error(err);
      }

      try {
        const getEmployeesForSwiping = await UsersService.getEmployeesForSwiping({
          jobId: selectedJob._id,
          preferences: preferencesObject,
        });
        dispatch(setSwipingDataRedux(getEmployeesForSwiping));
      } catch (err) {
        console.error(err);
      }
      dispatch(
        setEmployerJobPreferencesRedux({ jobId: selectedJob._id || '', updateJobPreferencesObject: preferencesObject }),
      );
      dispatch(setSelectedJobPreferencesRedux(preferencesObject));

      setPreferencesHaveChanged(false);
      setIsJobPreferencesModalVisible(false);
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

  return (
    <Modal animationType='slide' visible={isJobPreferencesModalVisible}>
      <KeeperSpinnerOverlay isLoading={isPreferenceUpdateLoading} />

      <View style={styles.preferenceModalContainer}>
        <View style={styles.header}>
          <View style={styles.headerPill}>
            <View style={styles.leftSection}>{<MaterialIcon onPress={closeModal} name='close' size={30} />}</View>
            <View style={styles.titleSection}>
              <AppHeaderText style={styles.titleText}>What kind of employees do you want to see?</AppHeaderText>
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
              <AppText>{jobPreferences.isRemote ? 'Remote' : jobPreferences.address}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setCompensationModalVisible(true)}>
              <AppHeaderText>Compensation Range</AppHeaderText>
              <AppText>
                ${numberWithCommas(jobPreferences.compensation?.payRange?.min)} - $
                {numberWithCommas(jobPreferences.compensation?.payRange?.max)} per year
              </AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setExperienceModalVisible(true)}>
              <AppHeaderText>Years of Experience</AppHeaderText>
              <AppText>{`${jobPreferences.yearsOfExperience} years`}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.preferenceItem} onPress={() => setEducationModalVisible(true)}>
              <AppHeaderText>Education</AppHeaderText>
              <AppText>{showEducationText(jobPreferences.education)}</AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity> */}
            <TouchableOpacity style={styles.preferenceItem} onPress={() => setSkillsModalVisible(true)}>
              <AppHeaderText>Skills</AppHeaderText>
              <AppText numberOfLines={1} style={{ width: '90%' }}>
                {jobPreferences.relevantSkills.join(', ')}
              </AppText>
              <MaterialIcon style={styles.openItemIcon} name='arrow-forward-ios' size={20} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
      <Compensation
        jobColor={selectedJob.color}
        compensation={jobPreferences.compensation}
        setCompensation={value => updateJobPreferencesState(value, 'compensation')}
        compensationModalVisible={compensationModalVisible}
        setCompensationModalVisible={setCompensationModalVisible}
      />
      <ExperienceModal
        experience={jobPreferences.yearsOfExperience}
        setExperience={(value: any) => updateJobPreferencesState(value, 'yearsOfExperience')}
        experienceModalVisible={experienceModalVisible}
        setExperienceModalVisible={setExperienceModalVisible}
      />
      <RequiredSkillsModal
        requiredSkills={jobPreferences.relevantSkills || []}
        setRequiredSkills={(value: any) => updateJobPreferencesState(value, 'relevantSkills')}
        requiredSkillsModalVisible={skillsModalVisible}
        setRequiredSkillsModalVisible={setSkillsModalVisible}
      />
    </Modal>
  );
};

export default JobPreferencesModal;
