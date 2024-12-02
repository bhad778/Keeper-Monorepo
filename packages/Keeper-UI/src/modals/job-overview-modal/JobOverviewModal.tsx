import React from 'react';
import { View, TextInput } from 'react-native';
import Modal from 'react-native-modal';

import { ModalHeader } from 'components';

import { useStyles } from './JobOverviewModalStyles';

type JobOverviewModalProps = {
  jobOverview: string;
  setJobOverview: (value: text) => void;
  jobOverviewModalVisible: boolean;
  setJobOverviewModalVisible: (jobOverviewModalVisible: boolean) => void;
};

const JobOverviewModal = ({
  jobOverview,
  setJobOverview,
  jobOverviewModalVisible,
  setJobOverviewModalVisible,
}: JobOverviewModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={jobOverviewModalVisible}>
      <View style={styles.textSection}>
        <ModalHeader
          saveText={setJobOverview}
          text={jobOverview}
          leftIcon='chevron-left'
          screenTitle='The Role'
          border={1}
          closeModal={setJobOverviewModalVisible}
        />

        <TextInput
          placeholder='Sell the business! Tell us about the company and what they do.'
          placeholderTextColor='black'
          value={jobOverview}
          style={styles.textInput}
          multiline={true}
          autoFocus
          onChangeText={jobOverview => setJobOverview(jobOverview)}
        />
      </View>
    </Modal>
  );
};

export default JobOverviewModal;
