import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { useStyles } from './ExperienceModalStyles';
import { AppBoldText, EditProfileTitle, RedesignModalHeader } from 'components';
import Slider from '@react-native-community/slider';
import { useTheme } from 'theme/theme.context';

type ExperienceModalProps = {
  experience: any;
  setExperience: any;
  experienceModalVisible: boolean;
  setExperienceModalVisible: (experienceModalVisible: boolean) => void;
};

const ExperienceModal = ({
  experience,
  setExperience,
  experienceModalVisible,
  setExperienceModalVisible,
}: ExperienceModalProps) => {
  const [localYearsOfExperience, setLocalYearsOfExperience] = useState(experience || 0);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();
  const { theme } = useTheme();

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalYearsOfExperience(experience || 0);
  }, [experienceModalVisible]);

  const saveExperience = () => {
    setExperience(localYearsOfExperience);
    closeModal();
  };

  const onChange = (newValue: number) => {
    setLocalYearsOfExperience(newValue);
  };

  const onChangeCommitted = () => {
    setHasSelectionChanged(true);
  };

  const closeModal = () => {
    setExperienceModalVisible(false);
    setHasSelectionChanged(false);
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={experienceModalVisible}>
      <RedesignModalHeader
        title='EXPERIENCE'
        goBackAction={closeModal}
        onSave={saveExperience}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.yrsExperienceContainer}>
        <AppBoldText style={styles.yearsText}>{`${localYearsOfExperience} Years`} </AppBoldText>

        <Slider
          value={localYearsOfExperience}
          onValueChange={onChange}
          onSlidingComplete={onChangeCommitted}
          maximumTrackTintColor='grey'
          minimumTrackTintColor={theme.color.pink}
          style={styles.slider}
          step={1}
          // these equal 10 and 100 miles in meters
          minimumValue={0}
          maximumValue={50}
        />
        <EditProfileTitle text='Required Years of Experience' textStyles={styles.titleText} />
      </View>
    </Modal>
  );
};

export default ExperienceModal;
