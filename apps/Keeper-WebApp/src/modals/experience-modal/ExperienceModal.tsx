import { useState } from 'react';
import { AppBoldText, AppHeaderText, KeeperModal, ModalSaveButton } from 'components';
import Slider from '@mui/material/Slider';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './ExperienceModalStyles';

type ExperienceModalProps = {
  experience: any;
  setExperience: any;
  setExperienceModalVisible: (experienceModalVisible: boolean) => void;
};

const ExperienceModal = ({ experience, setExperience, setExperienceModalVisible }: ExperienceModalProps) => {
  const [localYearsOfExperience, setLocalYearsOfExperience] = useState(experience || 0);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();
  const { theme } = useTheme();

  const saveExperience = () => {
    setExperience(localYearsOfExperience);
    closeModal();
  };

  const onChange = (event: Event, newValue: number | number[]) => {
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
    <KeeperModal isOpen modalStyles={styles.modal} closeModal={closeModal}>
      <ModalSaveButton onSaveClick={saveExperience} disabled={!hasSelectionChanged} />
      <div style={{ marginBottom: 40 }}>
        <AppHeaderText
          style={{
            color: 'white',
            fontSize: 24,
          }}
        >
          EXPERIENCE
        </AppHeaderText>
      </div>

      <AppBoldText style={styles.yearsText}>{`${localYearsOfExperience} Years`} </AppBoldText>

      <Slider
        value={localYearsOfExperience}
        onChange={onChange}
        onChangeCommitted={onChangeCommitted}
        style={styles.slider}
        step={1}
        sx={{
          '& .MuiSlider-thumb': {
            color: 'white',
          },
          '& .MuiSlider-track': {
            color: theme.color.pink,
          },
          '& .MuiSlider-rail': {
            color: theme.color.keeperGrey,
          },
        }}
        marks
        min={0}
        max={30}
      />
    </KeeperModal>
  );
};

export default ExperienceModal;
