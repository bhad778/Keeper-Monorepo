import React from 'react';
import Modal from 'react-native-modal';

import { useStyles } from './PreviewJobModalStyles';

type PreviewModalProps = {
  isViewJobPostingModalVisible: boolean;
  children: React.ReactNode;
};

const PreviewModal = ({ isViewJobPostingModalVisible, children }: PreviewModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={isViewJobPostingModalVisible}>
      {children}
    </Modal>
  );
};

export default PreviewModal;
