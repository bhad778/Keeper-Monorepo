import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';
import ModalHeader from 'components/modal-header/ModalHeader';
import Modal from 'react-native-modal';
import { useStyles } from './TargetSalaryModalStyles';
import { AppText } from 'components';
import { useTheme } from 'theme/theme.context';

type TargetSalaryModal = {
  compensationModalVisible: boolean;
  setCompensationModalVisible: (compensationModalVisible: boolean) => void;
  targetCompensation: any;
  setTargetCompensation: any;
};

const TargetSalaryModal = ({
  compensationModalVisible,
  setCompensationModalVisible,
  targetCompensation,
  setTargetCompensation,
}: TargetSalaryModal) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const numberWithCommas = x => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const onSliderChange = useCallback(
    (newValue: number) => {
      setTargetCompensation(newValue);
    },
    [setTargetCompensation],
  );

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={compensationModalVisible}>
      <View style={styles.sliderSection}>
        <ModalHeader
          leftIcon='chevron-left'
          border={1}
          closeModal={setCompensationModalVisible}
          screenTitle='Compensation'
        />

        <View>
          <View>
            <AppText>`$${numberWithCommas(targetCompensation)} per year`</AppText>
          </View>

          <Slider
            value={targetCompensation}
            onValueChange={onSliderChange}
            minimumTrackTintColor={theme.color.pink}
            style={{ width: 200, height: 40 }}
            minimumValue={30000}
            maximumValue={500000}
            step={5000}
          />
        </View>
      </View>
    </Modal>
  );
};

export default TargetSalaryModal;
