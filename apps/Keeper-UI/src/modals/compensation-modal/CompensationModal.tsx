import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import { KeeperSelectButton, AppHeaderText, AppText, RedesignModalHeader } from 'components';
import { EmploymentTypeEnum, TJobCompensation, EmploymentTypes } from 'keeperTypes';
import { numberWithCommas } from 'projectUtils';

import { useStyles } from './CompensationModalStyles';

type CompensationProps = {
  compensationModalVisible: boolean;
  setCompensationModalVisible: any;
  compensation: TJobCompensation;
  setCompensation: (compensation: TJobCompensation) => void;
  jobColor?: string;
};

const Compensation = ({
  compensationModalVisible,
  setCompensationModalVisible,
  compensation,
  setCompensation,
}: CompensationProps) => {
  const [localCompensation, setLocalCompensation] = useState(compensation);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();

  useEffect(() => {
    // every time you open or close the modal, localCompensation is synced with benefits from AddJob.tsx
    setLocalCompensation(compensation);
  }, [compensationModalVisible]);

  const onMultiSliderChange = (newValues: number | number[]) => {
    if (Array.isArray(newValues))
      setLocalCompensation({
        ...localCompensation,
        payRange: { min: newValues[0], max: newValues[1] },
      });
  };

  const onChangeCommitted = () => {
    setHasSelectionChanged(true);
  };

  const onSelectEmploymentType = (type: EmploymentTypes) => {
    const updateObject: TJobCompensation = {
      type,
      payRange: { min: 0, max: 0 },
    };
    if (type === 'Salary') {
      updateObject.payRange = { min: 60000, max: 100000 };
    } else if (type === 'Contract') {
      updateObject.payRange = { min: 20, max: 60 };
    } else if (type === 'Contract to Hire') {
      updateObject.payRange = { min: 20, max: 60 };
      updateObject.salaryConversionRange = { min: 60000, max: 100000 };
    }
    setLocalCompensation(updateObject);
  };

  const closeModal = () => {
    setCompensationModalVisible(false);
    setHasSelectionChanged(false);
  };

  const saveModal = () => {
    setCompensation(localCompensation);
    closeModal();
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={compensationModalVisible}>
      <RedesignModalHeader
        title='COMPENSATION'
        goBackAction={closeModal}
        onSave={saveModal}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.sliderSection}>
        <View style={styles.buttonsContainer}>
          {Object.keys(EmploymentTypeEnum)
            .filter(key => isNaN(Number(key)))
            .map((type, index) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={() => onSelectEmploymentType(type)}
                  title={type}
                  selected={localCompensation.type === type}
                  buttonStyles={styles.paymentTypeButtons}
                  isBig
                />
              );
            })}
        </View>

        <View>
          <View>
            <AppHeaderText style={[styles.text]}>Pay Range</AppHeaderText>
            <AppText style={styles.text}>
              {localCompensation?.type === 'Salary'
                ? `between $${numberWithCommas(localCompensation?.payRange?.min)} and $${numberWithCommas(
                    localCompensation?.payRange?.max,
                  )}/year`
                : `between $${localCompensation?.payRange?.min}/hour and $${localCompensation?.payRange?.max}/hour`}
            </AppText>
          </View>

          <MultiSlider
            touchDimensions={styles.touchDimensions}
            markerStyle={styles.markerStyle}
            selectedStyle={styles.selectedStyle}
            values={[localCompensation?.payRange?.min || 0, localCompensation?.payRange?.max || 0]}
            sliderLength={345}
            onValuesChange={onMultiSliderChange}
            onValuesChangeFinish={onChangeCommitted}
            min={localCompensation?.type === 'Salary' ? 15000 : 8}
            max={localCompensation?.type === 'Salary' ? 300000 : 150}
            step={localCompensation?.type === 'Salary' ? 5000 : 1}
            allowOverlap
            snapped
          />
        </View>
      </View>
    </Modal>
  );
};

export default Compensation;
