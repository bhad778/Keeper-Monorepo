import React from 'react';
import { AppHeaderText, KeeperTouchable } from 'components';

import useStyles from './ModalSaveButtonStyles';

type ModalSaveButtonProps = {
  onSaveClick: () => void;
  disabled: boolean;
};

const ModalSaveButton = ({ onSaveClick, disabled }: ModalSaveButtonProps) => {
  const styles = useStyles(disabled);

  return (
    <KeeperTouchable style={styles.modalSaveButton} onPress={onSaveClick} disabled={disabled}>
      <AppHeaderText style={styles.modalSaveText}>Save</AppHeaderText>
    </KeeperTouchable>
  );
};

export default ModalSaveButton;
