import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { EducationEnum } from 'keeperTypes';
import { KeeperSelectButton, ModalHeader } from 'components';
import { TAccountType } from '../../../../../shared/types';

import { useStyles } from './EducationModalStyles';

type EducationModalProps = {
  education: string;
  setEducation: (education: any) => void;
  educationModalVisible: boolean;
  setEducationModalVisible: (educationModalVisible: boolean) => void;
  jobColor?: string;
};

// 0 = Coding Bootcamp 1 = GED, 2 = Associate's, 3 = Bachelor's, 4 = Master's, 5 = Doctoral
// We do this because it has to be stored that way in DB to search
const EducationModal = ({
  education,
  setEducation,
  educationModalVisible,
  setEducationModalVisible,
  jobColor,
}: EducationModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={educationModalVisible}>
      <View style={styles.educationTypeContainer}>
        <ModalHeader leftIcon='chevron-left' screenTitle='Education' border={1} closeModal={setEducationModalVisible} />
        <View style={styles.buttonsContainer}>
          {Object.keys(EducationEnum)
            .filter(key => isNaN(Number(key)))
            .map((educationItem: string, index: number) => (
              <KeeperSelectButton
                onPress={() => setEducation(educationItem)}
                key={index}
                title={educationItem}
                selected={education === educationItem}
                buttonStyles={{ backgroundColor: jobColor }}
                isBig
              />
            ))}
        </View>
      </View>
    </Modal>
  );
};

export default EducationModal;
