import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { EditProfileTitle, KeeperSelectButton, KeeperSlider, RedesignModalHeader } from 'components';
import { useDidMountEffect } from 'hooks';
import { checkTwoArraysEqual } from 'utils/globalUtils';

import { useStyles } from './CultureModalStyles';
import { TLeanFrontEndOrBackendEnum } from 'types/globalTypes';
import { companySizeOptions, companyStructureOptions, operatingSystemOptions } from 'constants/globalConstants';

type CultureModalProps = {
  cultureModalVisible: boolean;
  setCultureModalVisible: (cultureModalVisibles: boolean) => void;
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
  leanFrontendOrBackendValue: string;
};

const CultureModal = ({ cultureModalVisible, setCultureModalVisible, setBenefits, benefits }: CultureModalProps) => {
  const styles = useStyles();

  const [localBenefits, setLocalBenefits] = useState(benefits);
  const [leanFrontendOrBackendNumber, setLeanFrontendOrBackendNumber] = useState(50);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalBenefits(benefits);
  }, [cultureModalVisible]);

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
    setCultureModalVisible(false);
    setHasSelectionChanged(false);
  };

  const onSave = () => {
    setBenefits(localBenefits);
    setCultureModalVisible(false);
    closeModal();
  };

  return (
    <Modal animationIn='slideInRight' animationOut='slideOutRight' isVisible={cultureModalVisible} style={styles.modal}>
      <RedesignModalHeader
        title='CULTURE'
        goBackAction={closeModal}
        onSave={onSave}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.educationTypeContainer}>
        <View style={styles.section}>
          <KeeperSlider
            title='Do you lean frontend or backend?'
            transformValueFunction={(leanFrontendOrBackendNumber: any) => {
              return TLeanFrontEndOrBackendEnum[leanFrontendOrBackendNumber];
            }}
            minimumValue={0}
            maximumValue={100}
            step={25}
            defaultValue={leanFrontendOrBackendNumber}
            onSliderComplete={setLeanFrontendOrBackendNumber}
          />
        </View>

        <View style={styles.section}>
          <EditProfileTitle
            text='What size company do you prefer?'
            // textStyles={returnErrorStyles('onSiteOptionsOpenTo')}
          />
          <View style={styles.buttonsContainer}>
            {companySizeOptions.map((option: string, index: number) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={value => console.log('asf')}
                  title={option}
                  // selected={editEmployeeState.onSiteOptionsOpenTo?.includes(option)}
                  // selectedButtonStyles={styles.selectedButtonStyles}
                  // unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.threeButton}
                  // textStyles={styles.workSettingButtonText}
                  // unSelectedTextStyles={styles.unSelectedTextStyles}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <EditProfileTitle
            text='Do you like a loose, do-it-yourself environment or more strutured?'
            // textStyles={returnErrorStyles('onSiteOptionsOpenTo')}
          />
          <View style={styles.buttonsContainer}>
            {companyStructureOptions.map((option: string, index: number) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={value => console.log('asf')}
                  title={option}
                  // selected={editEmployeeState.onSiteOptionsOpenTo?.includes(option)}
                  // selectedButtonStyles={styles.selectedButtonStyles}
                  // unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.threeButton}
                  // textStyles={styles.workSettingButtonText}
                  // unSelectedTextStyles={styles.unSelectedTextStyles}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <EditProfileTitle
            text='Do you prefer Mac or Windows environment?'
            // textStyles={returnErrorStyles('onSiteOptionsOpenTo')}
          />
          <View style={styles.buttonsContainer}>
            {operatingSystemOptions.map((option: string, index: number) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onPress={value => console.log('asf')}
                  title={option}
                  // selected={editEmployeeState.onSiteOptionsOpenTo?.includes(option)}
                  // selectedButtonStyles={styles.selectedButtonStyles}
                  // unSelectedButtonStyles={styles.unSelectedButtonStyles}
                  buttonStyles={styles.threeButton}
                  // textStyles={styles.workSettingButtonText}
                  // unSelectedTextStyles={styles.unSelectedTextStyles}
                />
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CultureModal;
