import { useState } from 'react';
import { TechnologiesList } from 'constants/TechnologiesList';
import { ChipsPicker, KeeperModal, ModalSaveButton } from 'components';

import { useStyles } from './RequiredSkillsModalStyles';

type RequiredSkillsModalProps = {
  setRequiredSkillsModalVisible: (searchRadiusModalVisible: boolean) => void;
  requiredSkills: string[];
  setRequiredSkills: (selectedChips: string[]) => void;
  saveButtonData?: {
    title: string;
    action: (localSelectedChips: string[]) => void;
  };
};

// wanted to turn off max count for now so made it really high
const maxCount = 50;

const RequiredSkillsModal = ({
  requiredSkills,
  setRequiredSkills,
  setRequiredSkillsModalVisible,
  saveButtonData,
}: RequiredSkillsModalProps) => {
  const [localSelectedChips, setLocalSelectedChips] = useState(requiredSkills);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();

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
    <KeeperModal modalStyles={styles.modal} isOpen closeModal={closeModal}>
      <ModalSaveButton
        title={saveButtonData ? saveButtonData.title : ''}
        onSaveClick={saveButtonData ? () => saveButtonData.action(localSelectedChips) : onSave}
        disabled={!hasSelectionChanged}
      />
      <div style={styles.container}>
        <div style={styles.chipsPickerContainer}>
          {/* <AppHeaderText style={styles.maxCountText}>Select up to {maxCount}</AppHeaderText> */}
          <ChipsPicker
            chipsData={TechnologiesList}
            selectedChips={localSelectedChips}
            setSelectedChips={onPressChip}
            maxCount={maxCount}
          />
        </div>
      </div>
    </KeeperModal>
  );
};

export default RequiredSkillsModal;
