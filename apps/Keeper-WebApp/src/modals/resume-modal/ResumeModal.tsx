import { useState } from 'react';
import { AppBoldText, AppHeaderText, Clickable, KeeperModal, KeeperSelectButton, ModalSaveButton } from 'components';
import { useTheme } from 'theme/theme.context';
import CloseIcon from '@mui/icons-material/Close';

import { useStyles } from './ResumeModalStyles';

type ResumeModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const ResumeModal = ({ isVisible, setIsVisible }: ResumeModalProps) => {
  const [localYearsOfExperience, setLocalYearsOfExperience] = useState();

  const styles = useStyles();
  const { theme } = useTheme();

  const closeModal = () => {
    setIsVisible(false);
  };

  const onUploadResumePress = () => {
    setIsVisible(false);
  };

  return (
    <KeeperModal isOpen={isVisible} modalStyles={styles.modal} closeModal={closeModal}>
      <div></div>
    </KeeperModal>
  );
};

export default ResumeModal;
