import React from 'react';
import { AppHeaderText, KeeperModal, KeeperSelectButton } from 'components';
import { View } from 'react-native';

import useStyles from './AlertModalStyles';

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  subTitle?: string;
  modalStyles?: React.CSSProperties;
  isOkButton?: boolean;
  confirmText?: string;
  denyText?: string;
  onConfirmPress?: () => void;
  closeModal: () => void;
};

const AlertModal = ({
  isOpen,
  title,
  subTitle,
  modalStyles,
  isOkButton,
  confirmText,
  denyText,
  onConfirmPress,
  closeModal,
}: AlertModalProps) => {
  const styles = useStyles();

  return (
    <KeeperModal isModalOpen={isOpen} closeModal={closeModal} modalStyles={{ ...styles.alertModal, ...modalStyles }}>
      <AppHeaderText style={styles.titleStyle}>{title}</AppHeaderText>
      {subTitle && <AppHeaderText style={styles.subTitleStyle}>{subTitle}</AppHeaderText>}
      <View style={styles.bottomButtonsContainer}>
        {isOkButton ? (
          <KeeperSelectButton
            onPress={closeModal}
            title='Ok'
            buttonStyles={styles.bottomButtonStyles}
            textStyles={styles.bottomButtonTextStyles}
          />
        ) : (
          <>
            <KeeperSelectButton
              onPress={closeModal}
              title={denyText || 'Cancel'}
              buttonStyles={styles.bottomButtonStyles}
              textStyles={styles.bottomButtonTextStyles}
            />
            <KeeperSelectButton
              onPress={onConfirmPress}
              title={confirmText || 'Yes'}
              buttonStyles={styles.bottomButtonStyles}
              textStyles={styles.bottomButtonTextStyles}
            />
          </>
        )}
      </View>
    </KeeperModal>
  );
};

export default AlertModal;
