import React, { useCallback, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import {
  DateInput,
  EditProfileTextInput,
  EditProfileTitle,
  LargeDescriptionBubble,
  RedesignModalHeader,
  KeeperSelectButton,
  LargeDescriptionModal,
  AppText,
  BottomSheet,
  AppHeaderText,
} from 'components';
import { deepEqualCheck } from 'utils';
import { TEmployeePastJob } from 'types';
import Checkbox from 'expo-checkbox';
import { AlertModal } from 'modals';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useKeyboardAvoidingViewOffset, useDidMountEffect } from 'hooks';

import { useStyles } from './JobHistoryItemModalStyles';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

const blankJobHistoryItem = {
  jobTitle: '',
  company: '',
  startDate: '',
  endDate: '',
  jobDescription: '',
};

type JobHistoryItemModalProps = {
  jobHistoryItem: TEmployeePastJob | null;
  jobHistory: TEmployeePastJob[];
  currentJobHistoryItem: any;
  setJobHistory: (jobHistory: TEmployeePastJob[]) => void;
  setCurrentJobHistoryItem: (currentJobHistoryItem: TEmployeePastJob | null) => void;
  hasCheckBeenPressed: boolean;
  hasUploadedResume: boolean;
};

const JobHistoryItemModal = ({
  jobHistoryItem,
  jobHistory,
  currentJobHistoryItem,
  hasCheckBeenPressed,
  setJobHistory,
  setCurrentJobHistoryItem,
  hasUploadedResume,
}: JobHistoryItemModalProps) => {
  const [jobHistoryItemState, setJobHistoryItemState] = useState<TEmployeePastJob | null>(jobHistoryItem);
  const [jobDescriptionModalVisible, setJobDescriptionModalVisible] = useState(false);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasSaveBeenPressed, setHasSaveBeenPressed] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { keyboardAvoidingViewOffset, onFocusTextInput, onFocusDateInput } = useKeyboardAvoidingViewOffset(0, -350);

  const isFieldComplete = useCallback((fieldValue: any, fieldTitle: string) => {
    // this case is to handle when they have checked that they are currently employed here
    if (fieldTitle === 'endDate' && fieldValue === null) {
      return true;
    }
    // this makes sure that it triggers validation if 00 is anywhere in the date
    if ((fieldTitle === 'startDate' || fieldTitle === 'endDate') && fieldValue && fieldValue.includes('00')) {
      return false;
    }
    return Array.isArray(fieldValue) ? fieldValue.length > 0 : !!fieldValue;
  }, []);

  const shouldShowRed = useCallback(
    (fieldValue: any, fieldTitle: string) => {
      if (currentJobHistoryItem === null) {
        return false;
      }

      // if they have pressed the check button from main screen and the field is incomplete, show red or
      // if they have pressed the check button from this screen and the field is incomplete, show red or
      // if they have uploaded resume and the field is incomplete
      return (
        (hasCheckBeenPressed && !isFieldComplete(fieldValue, fieldTitle)) ||
        (hasSaveBeenPressed && !isFieldComplete(fieldValue, fieldTitle)) ||
        (hasUploadedResume && !isFieldComplete(fieldValue, fieldTitle))
      );
    },
    [currentJobHistoryItem, hasSaveBeenPressed, hasUploadedResume, isFieldComplete],
  );

  const styles = useStyles(
    shouldShowRed(jobHistoryItemState?.jobTitle, 'jobTitle'),
    shouldShowRed(jobHistoryItemState?.company, 'company'),
    shouldShowRed(jobHistoryItemState?.jobDescription, 'jobDescription'),
    shouldShowRed(jobHistoryItemState?.startDate, 'startDate'),
    shouldShowRed(jobHistoryItemState?.endDate, 'endDate'),
  );

  const updateJobHistoryItemState = useCallback(
    (value: any, field: string) => {
      if (!dataHasChanged) {
        setDataHasChanged(true);
      }
      setJobHistoryItemState((prevState: any) => {
        return { ...prevState, [field]: value };
      });
    },
    [dataHasChanged],
  );

  const onDelete = useCallback(() => {
    const currentJobHistory = [...jobHistory];
    const index = jobHistory.findIndex((pastJob: TEmployeePastJob) => jobHistoryItem?.uuid === pastJob?.uuid);
    if (index != -1) {
      currentJobHistory.splice(index, 1);
    }

    setJobHistory(currentJobHistory);
    setCurrentJobHistoryItem(null);
  }, [jobHistory, jobHistoryItem?.uuid, setCurrentJobHistoryItem, setJobHistory]);

  useEffect(() => {
    const tempJobHistoryItem: TEmployeePastJob = { ...jobHistoryItem };
    if (tempJobHistoryItem?.uuid) {
      delete tempJobHistoryItem.uuid;
    }
    // this modal is opened by tempJobHistoryItem being set to non null value,
    // if its blank than that means its adding a new item, if not then its editting an item
    if (deepEqualCheck(tempJobHistoryItem, blankJobHistoryItem)) {
      setIsNew(true);
    } else {
      setIsNew(false);
    }
  }, [jobHistoryItem]);

  useDidMountEffect(() => {
    setDataHasChanged(false);
    setJobHistoryItemState(jobHistoryItem);
  }, [jobHistoryItem]);

  const checkIfAnyFieldIsIncomplete = useCallback(() => {
    // returns true if any field is incomplete
    return (
      !isFieldComplete(jobHistoryItemState?.jobTitle, 'jobTitle') ||
      !isFieldComplete(jobHistoryItemState?.company, 'company') ||
      !isFieldComplete(jobHistoryItemState?.jobDescription, 'jobDescription') ||
      !isFieldComplete(jobHistoryItemState?.startDate, 'startDate') ||
      !isFieldComplete(jobHistoryItemState?.endDate, 'endDate')
    );
  }, [
    isFieldComplete,
    jobHistoryItemState?.company,
    jobHistoryItemState?.endDate,
    jobHistoryItemState?.jobDescription,
    jobHistoryItemState?.jobTitle,
    jobHistoryItemState?.startDate,
  ]);

  const onSavePress = useCallback(() => {
    if (checkIfAnyFieldIsIncomplete()) {
      setHasSaveBeenPressed(true);
      setIsBottomSheetOpen(true);
      return;
    }

    let currentJobHistory = [...jobHistory];
    const index = jobHistory.findIndex((pastJob: TEmployeePastJob) => jobHistoryItem?.uuid === pastJob?.uuid);

    // if adding new item, add it to end of array,
    // if editing existing item, update that one only
    if (jobHistoryItemState != null) {
      if (index === -1) {
        currentJobHistory = [...jobHistory, jobHistoryItemState];
      } else {
        currentJobHistory[index] = jobHistoryItemState;
      }

      setJobHistory(currentJobHistory);
    }

    setCurrentJobHistoryItem(null);
  }, [
    checkIfAnyFieldIsIncomplete,
    jobHistory,
    jobHistoryItem?.uuid,
    jobHistoryItemState,
    setCurrentJobHistoryItem,
    setJobHistory,
  ]);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setHasSaveBeenPressed(false);
    setCurrentJobHistoryItem(null);
    closeAlertModal();
  }, [closeAlertModal, setCurrentJobHistoryItem]);

  const onBackButtonPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  }, [closeModal, dataHasChanged]);

  const openJobDescriptionModal = useCallback(() => {
    setJobDescriptionModalVisible(true);
  }, []);

  const onCheckboxSelect = useCallback(() => {
    updateJobHistoryItemState(jobHistoryItemState?.endDate != null ? null : '', 'endDate');
  }, [jobHistoryItemState?.endDate, updateJobHistoryItemState]);

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const onFocusDateWrapper = useCallback(() => {
    if (jobHistoryItemState?.startDate === '00/00') {
      updateJobHistoryItemState('', 'startDate');
    }
    if (jobHistoryItemState?.endDate === '00/00') {
      updateJobHistoryItemState('', 'endDate');
    }
    onFocusDateInput();
  }, [jobHistoryItemState?.endDate, jobHistoryItemState?.startDate, onFocusDateInput, updateJobHistoryItemState]);

  return (
    <Modal animationIn='slideInRight' animationOut='slideOutRight' style={styles.modal} isVisible={!!jobHistoryItem}>
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} rowNumber={2}>
        <AppHeaderText style={styles.finishFieldsText}>Finish All Fields Before Saving!</AppHeaderText>
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
          behavior={Platform.OS === 'ios' ? 'position' : undefined}
          keyboardVerticalOffset={keyboardAvoidingViewOffset}>
          <LargeDescriptionModal
            text={(jobHistoryItemState ? jobHistoryItemState?.jobDescription : jobHistoryItem?.jobDescription) || ''}
            setText={(value: string) => updateJobHistoryItemState(value, 'jobDescription')}
            isVisible={jobDescriptionModalVisible}
            setIsVisible={setJobDescriptionModalVisible}
            title='Job Description'
            placeholder='Describe your role...'
          />
          <RedesignModalHeader
            title={isNew ? 'ADD A JOB' : 'EDIT JOB'}
            goBackAction={onBackButtonPress}
            onSave={onSavePress}
            // isSaveDisabled={checkIfAnyFieldIsIncomplete() || !dataHasChanged}
          />

          <View style={styles.contents}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={onCheckboxSelect}>
              <AppText style={styles.currentlyEmployedText}>Are you currently employed here?</AppText>
              <Checkbox
                style={{
                  margin: 8,
                }}
                onValueChange={onCheckboxSelect}
                value={jobHistoryItemState?.endDate === null}
                color='grey'
              />
            </TouchableOpacity>

            <EditProfileTitle text='Job Title' textStyles={styles.jobTitle} />
            <EditProfileTextInput
              value={jobHistoryItemState?.jobTitle}
              stateKeyName='jobTitle'
              onChangeText={value => updateJobHistoryItemState(value, 'jobTitle')}
              onFocus={onFocusTextInput}
            />

            <EditProfileTitle text='Company Name' textStyles={styles.companyTitle} />
            <EditProfileTextInput
              value={jobHistoryItemState?.company}
              stateKeyName='company'
              onChangeText={value => updateJobHistoryItemState(value, 'company')}
              onFocus={onFocusTextInput}
            />

            <View style={styles.jobDescriptionContainer}>
              <EditProfileTitle text='Job Description' textStyles={styles.jobDescriptionTitle} />
              <LargeDescriptionBubble
                bubbleText={jobHistoryItemState?.jobDescription}
                openEditModal={openJobDescriptionModal}
              />
            </View>

            <View style={styles.datesContainer}>
              <DateInput
                title='Start Date (mm/yy)'
                dateString={jobHistoryItemState?.startDate || ''}
                setDateString={(newDate: string) => updateJobHistoryItemState(newDate, 'startDate')}
                titleStyles={styles.startDateTitle}
                onFocus={onFocusDateWrapper}
              />
              {jobHistoryItemState?.endDate != null && (
                <DateInput
                  title='End Date (mm/yy)'
                  dateString={jobHistoryItemState?.endDate}
                  setDateString={(newDate: string) => updateJobHistoryItemState(newDate, 'endDate')}
                  titleStyles={styles.endDateTitle}
                  onFocus={onFocusDateWrapper}
                />
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
        {!isNew && (
          <View style={styles.deleteButtonContainer}>
            <KeeperSelectButton onPress={onDelete} title='Delete Job' />
          </View>
        )}
      </KeyboardAwareScrollView>
    </Modal>
  );
};

export default JobHistoryItemModal;
