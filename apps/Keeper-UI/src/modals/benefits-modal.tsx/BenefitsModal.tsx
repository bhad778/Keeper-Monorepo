import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { KeeperSelectButton, RedesignModalHeader } from 'components';
import { benefitOptions } from 'constants/globalConstants';
import { useDidMountEffect } from 'hooks';
import { checkTwoArraysEqual } from 'projectUtils/globalUtils';

import { useStyles } from './BenefitsModalStyles';

type BenefitsModalProps = {
  benefitsModalVisible: boolean;
  setBenefitsModalVisible: (setBenefitsModalVisible: boolean) => void;
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
};

const BenefitsModal = ({
  benefitsModalVisible,
  setBenefitsModalVisible,
  setBenefits,
  benefits,
}: BenefitsModalProps) => {
  const styles = useStyles();

  const [localBenefits, setLocalBenefits] = useState(benefits);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalBenefits(benefits);
  }, [benefitsModalVisible]);

  useDidMountEffect(() => {
    if (benefits && localBenefits && checkTwoArraysEqual(benefits, localBenefits)) {
      setHasSelectionChanged(false);
    } else {
      setHasSelectionChanged(true);
    }
  }, [localBenefits]);

  const onButtonClick = (benefit: string) => {
    if (benefit === 'None') {
      if (localBenefits.includes('None')) {
        setLocalBenefits(localBenefits.filter(item => item !== 'None'));
      } else {
        setLocalBenefits(['None']);
      }
    } else {
      const currentBenefits = localBenefits.filter(item => item !== 'None');
      currentBenefits.includes(benefit)
        ? setLocalBenefits(currentBenefits.filter(item => item !== benefit))
        : setLocalBenefits([...currentBenefits, benefit]);
    }
  };

  const closeModal = () => {
    setBenefitsModalVisible(false);
    setHasSelectionChanged(false);
  };

  const onSave = () => {
    setBenefits(localBenefits);
    setBenefitsModalVisible(false);
    closeModal();
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      isVisible={benefitsModalVisible}
      style={styles.modal}>
      <RedesignModalHeader
        title='BENEFITS'
        goBackAction={closeModal}
        onSave={onSave}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.educationTypeContainer}>
        <View style={styles.benefitButtonsContainer}>
          {benefitOptions.map((benefit, index) => {
            return (
              <KeeperSelectButton
                key={index}
                onPress={() => onButtonClick(benefit)}
                title={benefit}
                selected={localBenefits.includes(benefit)}
                buttonStyles={styles.benefitButtons}
                isBig
              />
            );
          })}
        </View>
      </View>
    </Modal>
  );
};

export default BenefitsModal;
