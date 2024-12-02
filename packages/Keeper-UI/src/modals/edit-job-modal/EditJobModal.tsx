import React from 'react';
import Modal from 'react-native-modal';

import { AddJob } from 'screens';
import { TJob } from 'types';

type PreviewModalProps = {
  previewJobData: TJob;
  jobColor: string;
  isViewJobPostingModalVisible: boolean;
  setIsViewJobPostingModalVisible: (isVisible: boolean) => void;
};

const EditJobModal = ({ isViewJobPostingModalVisible, setIsViewJobPostingModalVisible }: PreviewModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={isViewJobPostingModalVisible}>
      <AddJob />
    </Modal>
  );
};

export default EditJobModal;
