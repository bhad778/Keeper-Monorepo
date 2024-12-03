import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import Slider from '@react-native-community/slider';

import { KeeperSelectButton, AppHeaderText, AppText, AppBoldText, RedesignModalHeader } from 'components';
import { EmploymentTypeEnum, EmploymentTypes, TEmployeeCompensation } from 'keeperTypes';
import { numberWithCommas } from 'projectUtils';

import { useStyles } from './EmployeeCompensationModalStyles';
import { useTheme } from 'theme/theme.context';

type CompensationProps = {
  compensationModalVisible: boolean;
  setCompensationModalVisible: any;
  compensation: TEmployeeCompensation;
  setCompensation: (compensation: TEmployeeCompensation) => void;
};

const Compensation = ({
  compensationModalVisible,
  setCompensationModalVisible,
  compensation,
  setCompensation,
}: CompensationProps) => {
  const styles = useStyles();
  const { theme } = useTheme();

  const updateHourlySlider = (newValue: number) => {
    setCompensation({ ...compensation, targetHourly: newValue });
  };

  const updateSalarySlider = (newValue: number) => {
    setCompensation({ ...compensation, targetSalary: newValue });
  };

  const onSelectEmploymentType = (selectedType: EmploymentTypes) => {
    let currentTypesOpenTo = [...compensation.typesOpenTo];
    if (currentTypesOpenTo.includes(selectedType)) {
      currentTypesOpenTo = currentTypesOpenTo.filter(e => e !== selectedType);
    } else {
      currentTypesOpenTo.push(selectedType);
    }
    const updateObject: TEmployeeCompensation = {
      typesOpenTo: currentTypesOpenTo,
      targetHourly: compensation.targetHourly || 50,
      targetSalary: compensation.targetSalary || 90000,
    };
    setCompensation(updateObject);
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={compensationModalVisible}>
      <RedesignModalHeader title='COMPENSATION' goBackAction={setCompensationModalVisible} />

      <View style={styles.sliderSection}>
        <View style={styles.buttonsContainer}>
          <AppBoldText style={styles.compensationTypeText}>What Compensation Types are you open to?</AppBoldText>
          {Object.keys(EmploymentTypeEnum)
            .filter(key => isNaN(Number(key)))
            .map((type, index) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={() => onSelectEmploymentType(type)}
                  title={type}
                  selected={compensation.typesOpenTo.includes(type)}
                  isBig
                />
              );
            })}
        </View>

        {(compensation.typesOpenTo.includes('Salary') || compensation.typesOpenTo.includes('Contract to Hire')) && (
          <>
            <View>
              <AppHeaderText style={styles.targetPay}>Target Salary Pay</AppHeaderText>
              <AppText style={styles.targetPay}>{`$${numberWithCommas(compensation.targetSalary)}`}</AppText>
            </View>
            <Slider
              value={compensation.targetSalary || 20}
              onValueChange={updateSalarySlider}
              style={styles.slider}
              maximumTrackTintColor='grey'
              minimumTrackTintColor={theme.color.pink}
              minimumValue={30000}
              maximumValue={300000}
              step={5000}
            />
          </>
        )}
        {(compensation.typesOpenTo.includes('Contract') || compensation.typesOpenTo.includes('Contract to Hire')) && (
          <>
            <View>
              <AppHeaderText>Target Hourly Pay</AppHeaderText>
              <AppText>{`$${numberWithCommas(compensation.targetHourly)}`}</AppText>
            </View>
            <Slider
              value={compensation.targetHourly || 20}
              onValueChange={updateHourlySlider}
              style={styles.slider}
              minimumTrackTintColor={theme.color.pink}
              minimumValue={10}
              maximumValue={150}
              step={1}
              thumbTintColor='black'
            />
          </>
        )}
      </View>
    </Modal>
  );
};

export default Compensation;
