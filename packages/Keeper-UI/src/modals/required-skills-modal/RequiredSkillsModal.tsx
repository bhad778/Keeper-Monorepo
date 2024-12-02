import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { TechnologiesList } from 'constants/TechnologiesList';
import { ChipsPickerV2, RedesignModalHeader } from 'components';

import { useStyles } from './RequiredSkillsModalStyles';

type RequiredSkillsModalProps = {
  requiredSkillsModalVisible: boolean;
  setRequiredSkillsModalVisible: (searchRadiusModalVisible: boolean) => void;
  requiredSkills: string[];
  setRequiredSkills: (selectedChips: string[]) => void;
  updateJobHistoryItemState?: (value: any, title: string) => void;
};

// wanted to turn off max count for now so made it really high
const maxCount = 50;

const RequiredSkillsModal = ({
  requiredSkillsModalVisible,
  setRequiredSkillsModalVisible,
  requiredSkills,
  setRequiredSkills,
}: RequiredSkillsModalProps) => {
  const [localSelectedChips, setLocalSelectedChips] = useState(requiredSkills);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    // every time you open or close the modal, localSelectedChips is synced with benefits from AddJob.tsx
    setLocalSelectedChips(requiredSkills);
  }, [requiredSkillsModalVisible]);

  const onPressChip = (selectedChips: string[]) => {
    setLocalSelectedChips(selectedChips);
    setHasSelectionChanged(true);
  };

  const closeModal = () => {
    setRequiredSkillsModalVisible(false);
    setHasSelectionChanged(false);
  };

  const onSave = () => {
    setRequiredSkills(localSelectedChips);
    closeModal();
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={requiredSkillsModalVisible}>
      <RedesignModalHeader
        title='SKILLS'
        goBackAction={closeModal}
        containerStyles={styles.headerStyles}
        onSave={onSave}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.container}>
        <View style={styles.chipsPickerContainer}>
          {/* <AppHeaderText style={styles.maxCountText}>Select up to {maxCount}</AppHeaderText> */}
          <ChipsPickerV2
            chipsData={TechnologiesList}
            selectedChips={localSelectedChips}
            setSelectedChips={onPressChip}
            maxCount={maxCount}
          />
        </View>
      </View>
    </Modal>
  );
};

export default RequiredSkillsModal;
