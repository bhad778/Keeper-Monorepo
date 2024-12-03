import { useCallback, useEffect, useState } from 'react';
import {
  DateInput,
  Header,
  KeeperSelectButton,
  LargeDescriptionModal,
  AppText,
  AppHeaderText,
  KeeperModal,
  Clickable,
  AlertModal,
  KeeperTextInput,
  ModalSaveButton,
} from 'components';
import { deepEqualCheck } from 'utils';
import { useDidMountEffect } from 'hooks';
import { TEmployeePastJob } from 'keeperTypes';
import { Checkbox } from '@mui/material';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './JobHistoryItemStyles';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

const blankJobHistoryItem: Omit<TEmployeePastJob, 'uuid'> = {
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
  setJobHistory,
  setCurrentJobHistoryItem,
  hasUploadedResume,
  hasCheckBeenPressed,
}: JobHistoryItemModalProps) => {
  const [jobHistoryItemState, setJobHistoryItemState] = useState<TEmployeePastJob | null>(jobHistoryItem);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasSaveBeenPressed, setHasSaveBeenPressed] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { theme } = useTheme();

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
    [currentJobHistoryItem, hasCheckBeenPressed, hasSaveBeenPressed, hasUploadedResume, isFieldComplete],
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
      if (!hasSelectionChanged) {
        setHasSelectionChanged(true);
      }
      setJobHistoryItemState((prevState: any) => {
        return { ...prevState, [field]: value };
      });
    },
    [hasSelectionChanged],
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
    setHasSelectionChanged(false);
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
  }, [jobHistoryItemState?.endDate, jobHistoryItemState?.startDate, updateJobHistoryItemState]);

  const closeModal = useCallback(() => {
    if (hasSelectionChanged && !isAlertModalOpen) {
      setIsAlertModalOpen(true);
    } else {
      setHasSaveBeenPressed(false);

      setCurrentJobHistoryItem(null);
    }
  }, [hasSelectionChanged, isAlertModalOpen, setCurrentJobHistoryItem]);

  const onConfirmAlertModalPress = () => {
    setHasSaveBeenPressed(false);
    setCurrentJobHistoryItem(null);

    setIsAlertModalOpen(false);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <KeeperModal isOpen={!!currentJobHistoryItem} closeModal={closeModal} modalStyles={styles.modal}>
      <ModalSaveButton onSaveClick={onSavePress} disabled={!hasSelectionChanged} />
      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={onConfirmAlertModalPress}
      />

      <KeeperModal isOpen={isBottomSheetOpen} closeModal={closeBottomSheet}>
        <AppHeaderText>Finish All Fields Before Saving!</AppHeaderText>
      </KeeperModal>

      <div style={styles.contents}>
        <Clickable style={styles.checkboxContainer} onClick={onCheckboxSelect}>
          <AppText style={styles.currentlyEmployedText}>Are you currently employed here?</AppText>
          <Checkbox
            style={{
              margin: 8,
              color: theme.color.white,
            }}
            onChange={onCheckboxSelect}
            checked={jobHistoryItemState?.endDate === null}
          />
        </Clickable>

        <KeeperTextInput
          value={jobHistoryItemState?.jobTitle}
          label='Job Title'
          onChange={value => updateJobHistoryItemState(value, 'jobTitle')}
          labelStyles={styles.jobTitle}
        />
        <KeeperTextInput
          value={jobHistoryItemState?.company}
          label='Company Name'
          onChange={value => updateJobHistoryItemState(value, 'company')}
          labelStyles={styles.companyTitle}
        />

        <div style={styles.jobDescriptionContainer}>
          <Header text='Job Description' textInputLabelStyle={styles.jobDescriptionTitle} />
          <LargeDescriptionModal
            text={(jobHistoryItemState ? jobHistoryItemState?.jobDescription : jobHistoryItem?.jobDescription) || ''}
            setText={(value: string) => updateJobHistoryItemState(value, 'jobDescription')}
            placeholder='Describe your role...'
          />
        </div>

        <div style={styles.datesContainer}>
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
        </div>
        <div style={styles.bottomButtonsContainer}>
          {/* <KeeperSelectButton
            textStyles={styles.saveText}
            buttonStyles={styles.saveButtons}
            onClick={onSavePress}
            title="Save"
          /> */}
          {!isNew && (
            <KeeperSelectButton
              textStyles={styles.deleteText}
              buttonStyles={styles.deleteButtons}
              onClick={onDelete}
              title='Delete Job'
            />
          )}
        </div>
      </div>
    </KeeperModal>
  );
};

export default JobHistoryItemModal;
