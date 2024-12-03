import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

import { ModalHeader, KeeperSelectButton } from 'components';
import { EmploymentTypeEnum } from 'keeperTypes';
import { useStyles } from './EmploymentModalStyles';

type EmploymentModalProps = {
  jobColor: string;
  employmentType: any;
  setEmploymentType: any;
  employmentModalVisible: boolean;
  setEmploymentModalVisible: (employmentModalVisible: boolean) => void;
};

const EmploymentModal = ({
  jobColor,
  employmentType,
  setEmploymentType,
  employmentModalVisible,
  setEmploymentModalVisible,
}: EmploymentModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={employmentModalVisible}>
      <View style={styles.employmentTypeContainer}>
        <ModalHeader
          leftIcon='chevron-left'
          screenTitle='Employment'
          closeModal={setEmploymentModalVisible}
          border={1}
        />
        <View style={styles.employmentButtonsContainer}>
          {Object.keys(EmploymentTypeEnum)
            .filter(key => isNaN(Number(key)))
            .map((type, index) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={() => setEmploymentType(type)}
                  title={type}
                  selected={employmentType === type}
                  buttonColor={jobColor}
                  isBig
                  textStyles={type.length < 17 ? styles.smallButtonText : ''}
                />
              );
            })}
        </View>
      </View>
    </Modal>
  );
};

export default EmploymentModal;
