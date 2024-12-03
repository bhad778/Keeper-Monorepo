import { useCallback, useEffect, useState } from 'react';
import {
  AlertModal,
  AppHeaderText,
  DateInput,
  Header,
  KeeperModal,
  KeeperSelectButton,
  KeeperTextInput,
  ModalSaveButton,
} from 'components';
import { useDidMountEffect } from 'hooks';
import { EducationEnum, TEmployeeEducation, TEmployeePastJob } from 'keeperTypes';
import { deepEqualCheck } from 'utils';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './EducationHistoryItemStyles';
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
  const [educationHistoryItemState, setEducationHistoryItemState] = useState<TEmployeeEducation>(educationHistoryItem);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [hasSaveBeenPressed, setHasSaveBeenPressed] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { theme } = useTheme();
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
    shouldShowRed(educationHistoryItemState?.school),
    shouldShowRed(educationHistoryItemState?.major),
    shouldShowRed(educationHistoryItemState?.degree),
    shouldShowRed(educationHistoryItemState?.endDate),
  );

  const checkIfAnyFieldIsIncomplete = useCallback(() => {
    // returns true if any field is incomplete
    return (
      !isFieldComplete(educationHistoryItemState?.school) ||
      !isFieldComplete(educationHistoryItemState?.major) ||
      !isFieldComplete(educationHistoryItemState?.degree) ||
      !isFieldComplete(educationHistoryItemState?.endDate)
    );
  }, [
    isFieldComplete,
    educationHistoryItemState?.school,
    educationHistoryItemState?.major,
    educationHistoryItemState?.degree,
    educationHistoryItemState?.endDate,
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

  useDidMountEffect(() => {
    setHasSelectionChanged(false);
    setEducationHistoryItemState(educationHistoryItem);
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

  const updateEducationHistoryItemState = useCallback(
    (value: any, field: string) => {
      if (!hasSelectionChanged) {
        setHasSelectionChanged(true);
      }
      setEducationHistoryItemState((prevState: any) => {
        return { ...prevState, [field]: value };
      });
    },
    [hasSelectionChanged],
  );

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
      setEducationHistory([...educationHistory, educationHistoryItemState]);
    } else {
      currentEducationHistory[index] = educationHistoryItemState;
      setEducationHistory(currentEducationHistory);
    }
    setCurrentEducationItem(null);
  }, [
    checkIfAnyFieldIsIncomplete,
    educationHistory,
    educationHistoryItem?.uuid,
    educationHistoryItemState,
    setCurrentEducationItem,
    setEducationHistory,
  ]);

  const setEducation = useCallback(
    (value: any) => {
      updateEducationHistoryItemState(value, 'degree');
    },
    [updateEducationHistoryItemState],
  );

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
  }, []);

  const closeModal = useCallback(() => {
    if (hasSelectionChanged) {
      setIsAlertModalOpen(true);
    } else {
      setCurrentEducationItem(null);
      setHasSaveBeenPressed(false);
    }
  }, [hasSelectionChanged, setCurrentEducationItem]);

  const onConfirmAlertModalPress = () => {
    setCurrentEducationItem(null);
    setHasSaveBeenPressed(false);

    setIsAlertModalOpen(false);
  };

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  return (
    <KeeperModal isOpen={educationHistoryItemModalVisible} closeModal={closeModal} modalStyles={styles.modal}>
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
        <KeeperTextInput
          value={educationHistoryItemState?.school}
          label='Institution'
          onChange={value => updateEducationHistoryItemState(value, 'school')}
          labelStyles={styles.institutionTitle}
        />

        <KeeperTextInput
          value={educationHistoryItemState?.major}
          label='Area of Study'
          onChange={value => updateEducationHistoryItemState(value, 'major')}
          labelStyles={styles.areaOfStudyTitle}
        />

        <Header text='Degree Type' textInputLabelStyle={styles.degreeTitle} />
        <div style={styles.buttonsContainer}>
          {Object.keys(EducationEnum)
            .filter(key => isNaN(Number(key)))
            .map((educationItem: string, index: number) => (
              <KeeperSelectButton
                onClick={() => setEducation(educationItem)}
                key={index}
                title={educationItem}
                selected={educationHistoryItemState?.degree === educationItem}
                buttonStyles={styles.degreeButtons}
              />
            ))}
        </div>

        <div style={styles.datesContainer}>
          <DateInput
            title='Graduation Year'
            dateString={educationHistoryItemState?.endDate}
            isYear
            setDateString={(newDate: string) => updateEducationHistoryItemState(newDate, 'endDate')}
            titleStyles={styles.graduationYearTitle}
          />
        </div>
        <div style={styles.saveAndDeleteButtonsContainer}>
          {/* <KeeperSelectButton
            buttonStyles={{ width: '33%', backgroundColor: theme.color.white }}
            textStyles={{ color: theme.color.black }}
            onClick={onSavePress}
            title="Save"
          /> */}
          {!isNew && (
            <KeeperSelectButton
              buttonStyles={{
                width: '33%',
                backgroundColor: theme.color.pink,
                textAlign: 'center',
              }}
              onClick={onDelete}
              title='Delete Education'
            />
          )}
        </div>
      </div>
    </KeeperModal>
  );
};

export default EducationHistoryItemModal;
