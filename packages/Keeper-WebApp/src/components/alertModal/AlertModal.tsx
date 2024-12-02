import { AppHeaderText, KeeperModal, KeeperSelectButton } from 'components';

import useStyles from './AlertModalStyles';

type AlertModalProps = {
  isOpen: boolean;
  title: string;
  subTitle: string;
  modalStyles?: React.CSSProperties;
  confirmText?: string;
  denyText?: string;
  isOkButton?: boolean;
  onConfirmPress?: () => void;
  closeModal: () => void;
};

const AlertModal = ({
  isOpen,
  title,
  subTitle,
  modalStyles,
  confirmText,
  denyText,
  isOkButton,
  onConfirmPress,
  closeModal,
}: AlertModalProps) => {
  const styles = useStyles();

  return (
    <KeeperModal isOpen={isOpen} closeModal={closeModal} modalStyles={{ ...styles.alertModal, ...modalStyles }}>
      <AppHeaderText style={styles.titleStyle}>{title}</AppHeaderText>
      <AppHeaderText style={styles.subTitleStyle}>{subTitle}</AppHeaderText>
      <div style={styles.bottomButtonsContainer}>
        {isOkButton ? (
          <KeeperSelectButton
            onClick={closeModal}
            title="Ok"
            buttonStyles={styles.bottomButtonStyles}
            textStyles={styles.bottomButtonTextStyles}
          />
        ) : (
          <>
            <KeeperSelectButton
              onClick={closeModal}
              title={denyText || 'Cancel'}
              buttonStyles={styles.bottomButtonStyles}
              textStyles={styles.bottomButtonTextStyles}
            />
            <KeeperSelectButton
              onClick={onConfirmPress ? onConfirmPress : () => {}}
              title={confirmText || 'Yes'}
              buttonStyles={styles.bottomButtonStyles}
              textStyles={styles.bottomButtonTextStyles}
            />
          </>
        )}
      </div>
    </KeeperModal>
  );
};

export default AlertModal;
