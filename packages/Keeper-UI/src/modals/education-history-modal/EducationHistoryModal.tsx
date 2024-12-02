import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { v4 as uuidv4 } from 'uuid';
import { EducationListItem, KeeperSelectButton, RedesignModalHeader } from 'components';
import { TEmployeeEducation } from 'types';
import { AlertModal, EducationHistoryItemModal } from 'modals';
import { deepEqualCheck, isEducationHistoryItemComplete } from 'utils';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './EducationHistoryStyles';
import ArrowRightWhite from '../../assets/svgs/arrow_right_white.svg';
import ArrowRightRed from '../../assets/svgs/arrow_right_red.svg';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

type EducationHistoryModalProps = {
  educationHistory: TEmployeeEducation[];
  setEducationHistory: any;
  educationHistoryModalVisible: boolean;
  setEducationHistoryModalVisible: any;
  hasCheckBeenPressed: boolean;
  hasUploadedResume: boolean;
};

const EducationHistoryModal = ({
  educationHistory,
  setEducationHistory,
  educationHistoryModalVisible,
  setEducationHistoryModalVisible,
  hasCheckBeenPressed,
  hasUploadedResume,
}: EducationHistoryModalProps) => {
  const [localEducationHistory, setLocalEducationHistory] = useState<TEmployeeEducation[]>(educationHistory);
  const [currentEducationItem, setCurrentEducationItem] = useState<TEmployeeEducation | null>(null);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const styles = useStyles();
  const { theme } = useTheme();

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalEducationHistory(educationHistory);
    setDataHasChanged(false);
  }, [educationHistoryModalVisible]);

  useEffect(() => {
    if (!deepEqualCheck(educationHistory, localEducationHistory)) {
      setDataHasChanged(true);
    }
  }, [localEducationHistory]);

  const isEducationHistoryItemCompleteWithChecks = (educationItem: TEmployeeEducation) => {
    if (!hasCheckBeenPressed && !hasUploadedResume) {
      return true;
    }

    return isEducationHistoryItemComplete(educationItem);
  };

  const addEducationItem = () => {
    setCurrentEducationItem({
      uuid: uuidv4(),
      school: '',
      major: '',
      endDate: '',
      degree: '',
    });
  };

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setEducationHistoryModalVisible(false);
    closeAlertModal();
  }, [closeAlertModal, setEducationHistoryModalVisible]);

  const onSavePress = useCallback(() => {
    closeModal();

    setEducationHistory(localEducationHistory);
  }, [closeModal, localEducationHistory, setEducationHistory]);

  const onBackButtonPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  }, [closeModal, dataHasChanged]);

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={educationHistoryModalVisible}>
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeModal}
      />

      <EducationHistoryItemModal
        educationHistoryItem={currentEducationItem}
        educationHistory={localEducationHistory}
        setEducationHistory={setLocalEducationHistory}
        educationHistoryItemModalVisible={!!currentEducationItem}
        setCurrentEducationItem={setCurrentEducationItem}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
      />
      <RedesignModalHeader
        title='EDUCATION'
        goBackAction={onBackButtonPress}
        onSave={onSavePress}
        isSaveDisabled={!dataHasChanged}
      />

      <View style={styles.contents}>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          {localEducationHistory.map((educationItem: TEmployeeEducation, index: number) => {
            const isComplete = isEducationHistoryItemCompleteWithChecks(educationItem);

            return (
              <TouchableOpacity
                style={[
                  styles.preferenceItem,
                  index === 0 ? { marginTop: 0 } : { marginTop: 20 },
                  index + 1 === localEducationHistory.length ? { borderBottomWidth: 0 } : {},
                  { borderBottomColor: isComplete ? 'white' : theme.color.alert },
                ]}
                onPress={() => setCurrentEducationItem(educationItem)}
                key={index}>
                <EducationListItem educationItem={educationItem} index={index} textColor='white' />

                {isComplete ? (
                  <ArrowRightWhite style={styles.forwardIcon} />
                ) : (
                  <ArrowRightRed style={styles.forwardIcon} />
                )}
              </TouchableOpacity>
            );
          })}
          <KeeperSelectButton
            onPress={addEducationItem}
            title='ADD EDUCATION'
            buttonStyles={styles.addItemButton}
            textStyles={styles.addItemButtonText}
          />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default EducationHistoryModal;
