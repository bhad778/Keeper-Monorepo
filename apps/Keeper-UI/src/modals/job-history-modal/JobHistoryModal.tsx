import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import { v4 as uuidv4 } from 'uuid';
import Checkbox from 'expo-checkbox';
import { AppText, KeeperSelectButton, PastJobItem, RedesignModalHeader } from 'components';
import { TEmployeePastJob } from 'keeperTypes';
import { AlertModal, JobHistoryItemModal } from 'modals';
import { useReorderJobHistory } from 'hooks';
import { deepEqualCheck } from 'projectUtils';

import { useStyles } from './JobHistoryModalStyles';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

type JobHistoryModalProps = {
  jobHistory: TEmployeePastJob[];
  setJobHistory: (jobHistory: TEmployeePastJob[]) => void;
  jobHistoryModalVisible: boolean;
  setJobHistoryModalVisible: (newValue: boolean) => void;
  isSeekingFirstJob: boolean | undefined;
  setIsSeekingFirstJob: (newValue: boolean) => void;
  hasCheckBeenPressed: boolean;
  hasUploadedResume: boolean;
  uncompletedFieldsArray: string[];
};

const JobHistoryModal = ({
  jobHistory,
  setJobHistory,
  jobHistoryModalVisible,
  setJobHistoryModalVisible,
  isSeekingFirstJob,
  setIsSeekingFirstJob,
  hasCheckBeenPressed,
  hasUploadedResume,
  uncompletedFieldsArray,
}: JobHistoryModalProps) => {
  const [localJobHistory, setLocalJobHistory] = useState<TEmployeePastJob[]>(jobHistory);
  const [currentJobHistoryItem, setCurrentJobHistoryItem] = useState<TEmployeePastJob | null>(null);
  const [dataHasChanged, setDataHasChanged] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const returnErrorStyles = () => {
    if (
      uncompletedFieldsArray.includes('jobHistoryCompleteWithNoSkills') ||
      (uncompletedFieldsArray.includes('noPastSoftwareJobsButNoSkillsSelected') &&
        (hasCheckBeenPressed || hasUploadedResume))
    ) {
      return styles.errorText;
    }
  };

  const styles = useStyles();
  const { reorderedJobHistory } = useReorderJobHistory(localJobHistory);

  useEffect(() => {
    // every time you open or close the modal, localBenefits is synced with benefits from AddJob.tsx
    setLocalJobHistory(jobHistory);
    setDataHasChanged(false);
  }, [jobHistoryModalVisible]);

  useEffect(() => {
    if (!deepEqualCheck(jobHistory, localJobHistory)) {
      setDataHasChanged(true);
    }
  }, [localJobHistory]);

  useEffect(() => {
    setDataHasChanged(true);
  }, [isSeekingFirstJob]);

  const onIsSeekingFirstJobPress = useCallback(
    (newValue: boolean) => {
      setIsSeekingFirstJob(newValue);
    },
    [setIsSeekingFirstJob],
  );

  const addJobHistoryItem = () => {
    setCurrentJobHistoryItem({
      uuid: uuidv4(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      jobDescription: '',
      isNonTechJob: false,
    });
  };

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    setJobHistoryModalVisible(false);
    closeAlertModal();
  }, [closeAlertModal, setJobHistoryModalVisible]);

  const onBackButtonPress = useCallback(() => {
    if (dataHasChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  }, [closeModal, dataHasChanged]);

  const onSavePress = useCallback(() => {
    closeModal();

    // have to do this or else it scrolls to the top of EditEmployee for some reason
    setTimeout(() => {
      setJobHistory(localJobHistory);
    }, 500);
  }, [closeModal, localJobHistory, setJobHistory]);

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={jobHistoryModalVisible}>
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeModal}
      />

      <JobHistoryItemModal
        jobHistoryItem={currentJobHistoryItem}
        jobHistory={localJobHistory}
        setJobHistory={setLocalJobHistory}
        currentJobHistoryItem={currentJobHistoryItem}
        setCurrentJobHistoryItem={setCurrentJobHistoryItem}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
      />

      <RedesignModalHeader
        title='JOB HISTORY'
        goBackAction={onBackButtonPress}
        onSave={onSavePress}
        isSaveDisabled={!dataHasChanged}
      />

      <View style={styles.contents}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => onIsSeekingFirstJobPress(!isSeekingFirstJob)}
          hitSlop={{ top: 30, right: 70, left: 30, bottom: 30 }}>
          <>
            <AppText style={[styles.areYouLooking, returnErrorStyles()]}>Don&apos;t have any past jobs?</AppText>
            <Checkbox
              style={styles.checkBox}
              value={isSeekingFirstJob}
              color={isSeekingFirstJob ? '#4630EB' : undefined}
            />
          </>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
          <>
            {reorderedJobHistory &&
              reorderedJobHistory.map((pastJob: TEmployeePastJob, index: number) => (
                <PastJobItem
                  job={pastJob}
                  jobHistoryLength={localJobHistory.length}
                  index={index}
                  hasCheckBeenPressed={hasCheckBeenPressed}
                  hasUploadedResume={hasUploadedResume}
                  key={index}
                  onPress={() => setCurrentJobHistoryItem(pastJob)}
                  isWhite
                  isJobHistoryScreen={true}
                />
              ))}
            <KeeperSelectButton
              onPress={addJobHistoryItem}
              title='ADD A JOB'
              buttonStyles={styles.addItemButton}
              textStyles={styles.addItemButtonText}
            />
          </>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default JobHistoryModal;
