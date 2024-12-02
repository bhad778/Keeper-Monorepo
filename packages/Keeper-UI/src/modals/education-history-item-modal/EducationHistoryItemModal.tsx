import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  AppHeaderText,
  BottomSheet,
  DateInput,
  EditProfileTextInput,
  EditProfileTitle,
  KeeperSelectButton,
  RedesignModalHeader,
} from 'components';
import { EducationEnum, TEmployeeEducation, TEmployeePastJob } from 'types';
import { AlertModal } from 'modals';
import { deepEqualCheck } from 'utils';
import { useKeyboardAvoidingViewOffset } from 'hooks';

import { useStyles } from './EducationHistoryItemModalStyles';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

const blankEducationHistoryItem: TEmployeeEducation = {
  school: '',
  major: '',
  endDate: '',
  degree: '',
};

type EducationHistoryItemModalProps = {
  educationHistoryItem: TEmployeeEducation;
  educationHistory: TEmployeeEducation[];
  setEducationHistory: (educationHistory: TEmployeeEducation[]) => void;
  educationHistoryItemModalVisible: boolean;
  setCurrentEducationItem: (currentEducationHistoryItem: TEmployeePastJob | null) => void;
  hasCheckBeenPressed: boolean;
  hasUploadedResume: boolean;
};

const EducationHistoryItemModal = ({
  educationHistoryItem,
  educationHistory,
  setEducationHistory,
  educationHistoryItemModalVisible,
  setCurrentEducationItem,
  hasCheckBeenPressed,
  hasUploadedResume,
}: EducationHistoryItemModalProps) => {
  const [localEducationHistoryItem, setLocalEducationHistoryItem] = useState<TEmployeeEducation>(educationHistoryItem);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasSaveBeenPressed, setHasSaveBeenPressed] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { keyboardAvoidingViewOffset, onFocusTextInput, onFocusDateInput } = useKeyboardAvoidingViewOffset(-170, -350);

  useEffect(() => {
    setDataHasChanged(false);
    if (educationHistoryItemModalVisible) {
      setLocalEducationHistoryItem(educationHistoryItem);
    }
  }, [educationHistoryItemModalVisible, educationHistoryItem]);

  useEffect(() => {
    if (educationHistoryItem != null && !deepEqualCheck(educationHistoryItem, localEducationHistoryItem)) {
      setDataHasChanged(true);
    }
  }, [localEducationHistoryItem, educationHistoryItem]);

  const isFieldComplete = useCallback((field: any) => {
    return !!field;
  }, []);

  const shouldShowRed = useCallback(
    (field: any) => {
      if (educationHistoryItem === null) {
        return false;
      }
      return (
        (hasCheckBeenPressed && !isFieldComplete(field)) ||
        (hasSaveBeenPressed && !isFieldComplete(field)) ||
        (hasUploadedResume && !isFieldComplete(field))
      );
    },
    [educationHistoryItem, hasCheckBeenPressed, hasSaveBeenPressed, hasUploadedResume, isFieldComplete],
  );

  const styles = useStyles(
    shouldShowRed(localEducationHistoryItem?.school),
    shouldShowRed(localEducationHistoryItem?.major),
    shouldShowRed(localEducationHistoryItem?.degree),
    shouldShowRed(localEducationHistoryItem?.endDate),
  );

  const checkIfAnyFieldIsIncomplete = useCallback(() => {
    // returns true if any field is incomplete
    return (
      !isFieldComplete(localEducationHistoryItem?.school) ||
      !isFieldComplete(localEducationHistoryItem?.major) ||
      !isFieldComplete(localEducationHistoryItem?.degree) ||
      !isFieldComplete(localEducationHistoryItem?.endDate)
    );
  }, [
    isFieldComplete,
    localEducationHistoryItem?.school,
    localEducationHistoryItem?.major,
    localEducationHistoryItem?.degree,
    localEducationHistoryItem?.endDate,
  ]);

  useEffect(() => {
    const tempEducationHistoryItem = { ...educationHistoryItem };
    if (tempEducationHistoryItem) {
      delete tempEducationHistoryItem.uuid;
    }

    // this modal is opened by tempJobHistoryItem being set to non null value,
    // if its blank than that means its adding a new item, if not then its editting an item
    if (deepEqualCheck(tempEducationHistoryItem, blankEducationHistoryItem)) {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [educationHistoryItem]);

  const onDelete = () => {
    const currentEducationHistory = [...educationHistory];
    const index = educationHistory.findIndex(
      (pastEducationItem: TEmployeeEducation) => educationHistoryItem?.uuid === pastEducationItem?.uuid,
    );
    if (index != -1) {
      currentEducationHistory.splice(index, 1);
    }
    setEducationHistory(currentEducationHistory);
    setCurrentEducationItem(null);
  };

  const updateEducationHistoryItemState = useCallback((value: any, field: string) => {
    setLocalEducationHistoryItem((prevState: any) => {
      return { ...prevState, [field]: value };
    });
  }, []);

  const closeModal = useCallback(() => {
    setCurrentEducationItem(null);
    setHasSaveBeenPressed(false);
    setDataHasChanged(false);
    setIsAlertModalOpen(false);
  }, [setCurrentEducationItem]);

  const onSavePress = useCallback(() => {
    if (checkIfAnyFieldIsIncomplete()) {
      setHasSaveBeenPressed(true);
      setIsBottomSheetOpen(true);
      return;
    }
    const currentEducationHistory = [...educationHistory];
    const index = educationHistory.findIndex((educationItem: TEmployeeEducation) => {
      return educationHistoryItem?.uuid === educationItem?.uuid;
    });

    // if adding new item, add it to end of array,
    // if editing existing item, update that one only
    if (index === -1) {
      setEducationHistory([...educationHistory, localEducationHistoryItem]);
    } else {
      currentEducationHistory[index] = localEducationHistoryItem;
      setEducationHistory(currentEducationHistory);
    }
    closeModal();
  }, [
    checkIfAnyFieldIsIncomplete,
    closeModal,
    educationHistory,
    educationHistoryItem?.uuid,
    localEducationHistoryItem,
    setEducationHistory,
  ]);

  const onBackButtonPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  }, [closeModal, dataHasChanged]);

  const setEducation = useCallback(
    (value: any) => {
      updateEducationHistoryItemState(value, 'degree');
    },
    [updateEducationHistoryItemState],
  );

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={educationHistoryItemModalVisible}>
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} rowNumber={2}>
        <AppHeaderText>Finish All Fields Before Saving!</AppHeaderText>
      </BottomSheet>

      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeModal}
      />

      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          contentContainerStyle={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          keyboardVerticalOffset={keyboardAvoidingViewOffset}>
          <RedesignModalHeader
            title='EDUCATION'
            goBackAction={onBackButtonPress}
            onSave={onSavePress}
            // isSaveDisabled={checkIfAnyFieldIsIncomplete() || !dataHasChanged}
          />
          <View style={styles.contents}>
            <EditProfileTitle text='Institution' textStyles={styles.institutionTitle} />
            <EditProfileTextInput
              value={localEducationHistoryItem?.school}
              stateKeyName='school'
              onChangeText={value => updateEducationHistoryItemState(value, 'school')}
              onFocus={onFocusTextInput}
            />

            <EditProfileTitle text='Area of Study' textStyles={styles.areaOfStudyTitle} />
            <EditProfileTextInput
              value={localEducationHistoryItem?.major}
              stateKeyName='major'
              onChangeText={value => updateEducationHistoryItemState(value, 'major')}
              onFocus={onFocusTextInput}
            />

            <EditProfileTitle text='Degree Type' textStyles={styles.degreeTitle} />
            <View style={styles.buttonsContainer}>
              {Object.keys(EducationEnum)
                .filter(key => isNaN(Number(key)))
                .map((educationItem: string, index: number) => (
                  <KeeperSelectButton
                    onPress={() => setEducation(educationItem)}
                    key={index}
                    title={educationItem}
                    selected={localEducationHistoryItem?.degree === educationItem}
                    buttonStyles={styles.degreeButtons}
                  />
                ))}
            </View>

            <View style={styles.datesContainer}>
              <DateInput
                title='Graduation Year'
                dateString={localEducationHistoryItem?.endDate}
                isYear
                setDateString={(newDate: string) => updateEducationHistoryItemState(newDate, 'endDate')}
                titleStyles={styles.graduationYearTitle}
                onFocus={onFocusDateInput}
              />
            </View>
            {!isNew && (
              <KeeperSelectButton buttonStyles={styles.deleteButton} onPress={onDelete} title='Delete Education Item' />
            )}
          </View>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default EducationHistoryItemModal;
