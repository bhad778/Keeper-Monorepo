import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { AppBoldText, AppText, BottomSheet, RedesignModalHeader, BottomSheetRow } from 'components';
import { AddResponsibilityModal, AlertModal } from 'modals';
import { Ionicons } from '@expo/vector-icons';
import { useDidMountEffect } from 'hooks';
import { checkTwoArraysEqual } from 'projectUtils/globalUtils';

import { useStyles } from './ResponsibilitiesModalStyles';
import ArrowRight from '../../assets/svgs/arrow_right_black.svg';
import { backoutWithoutSavingSubTitle, backoutWithoutSavingTitle } from 'constants/globalConstants';

type ResponsibilitiesModalProps = {
  responsibilities: string[];
  responsibilitiesModalVisible: boolean;
  setResponsibilitiesModalVisible: (responsibilitiesModalVisible: boolean) => void;
  setResponsibilities: (responsibilities: any) => void;
  headerText: string;
};

const ResponsibilitiesModal = ({
  responsibilities,
  responsibilitiesModalVisible,
  setResponsibilitiesModalVisible,
  setResponsibilities,
}: ResponsibilitiesModalProps) => {
  const [selectedResponsibilityIndex, setSelectedResponsibilityIndex] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [localResponsibilities, setLocalResponsibilities] = useState(responsibilities);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const isNewResponsibility = selectedResponsibilityIndex === localResponsibilities.length;

  const styles = useStyles();

  useEffect(() => {
    // every time you open or close the modal, localResponsibilities is synced with responsibilities from AddJob.tsx
    setLocalResponsibilities(responsibilities);
    setHasSelectionChanged(false);
  }, [responsibilitiesModalVisible]);

  useDidMountEffect(() => {
    if (responsibilities && localResponsibilities && checkTwoArraysEqual(responsibilities, localResponsibilities)) {
      setHasSelectionChanged(false);
    } else {
      setHasSelectionChanged(true);
    }
  }, [localResponsibilities]);

  const openBottomSheet = useCallback((index: number) => {
    setIsBottomSheetOpen(true);
    setSelectedResponsibilityIndex(index);
  }, []);

  const closeBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(false);
    setSelectedResponsibilityIndex(null);
  }, []);

  const removeTextBox = useCallback(() => {
    if (selectedResponsibilityIndex != null) {
      const removeResponsibility = [...localResponsibilities];
      removeResponsibility.splice(selectedResponsibilityIndex, 1);
      setLocalResponsibilities(removeResponsibility);
    }
    closeBottomSheet();
  }, [closeBottomSheet, localResponsibilities, selectedResponsibilityIndex, setLocalResponsibilities]);

  const upsertResponsibility = (newResponsibility: string) => {
    if (isNewResponsibility) {
      setLocalResponsibilities([...localResponsibilities, newResponsibility]);
    } else if (selectedResponsibilityIndex !== null) {
      const currentResponsibilities = [...localResponsibilities];
      currentResponsibilities[selectedResponsibilityIndex] = newResponsibility;
      setLocalResponsibilities(currentResponsibilities);
    }
    setIsEditModalOpen(false);
    setSelectedResponsibilityIndex(null);
  };

  const textBox = useCallback(
    (responsibility: string, index: number) => {
      return (
        <View key={index} style={styles.textAreasContainer}>
          <TouchableOpacity
            style={styles.ellipsis}
            onPress={() => openBottomSheet(index)}
            hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
            <Ionicons name='ellipsis-vertical' size={35} color='white' />
          </TouchableOpacity>
          <View style={styles.textAreas}>
            <AppText style={styles.text} numberOfLines={3}>
              {responsibility}
            </AppText>
          </View>
        </View>
      );
    },
    [openBottomSheet, styles.ellipsis, styles.text, styles.textAreas, styles.textAreasContainer],
  );

  const onAddItemPress = useCallback(() => {
    setSelectedResponsibilityIndex(localResponsibilities?.length);
    setIsEditModalOpen(true);
  }, [localResponsibilities?.length]);

  const openEditModal = useCallback(() => {
    setIsBottomSheetOpen(false);
    setTimeout(() => {
      setIsEditModalOpen(true);
    }, 500);
  }, []);

  const onBackButtonPress = () => {
    if (hasSelectionChanged) {
      setIsAlertModalOpen(true);
    } else {
      closeModal();
    }
  };

  const closeModal = () => {
    setHasSelectionChanged(false);
    setResponsibilitiesModalVisible(false);
    closeAlertModal();
    closeIsEditModal();
  };

  const closeIsEditModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const saveModal = () => {
    // remove blank responsibilities
    const filteredResponsibilities = localResponsibilities.filter(resp => resp != '');

    setResponsibilities(filteredResponsibilities);
    closeModal();
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={responsibilitiesModalVisible}>
      <BottomSheet isOpen={isBottomSheetOpen} closeModal={closeBottomSheet} rowNumber={2}>
        <BottomSheetRow onPress={openEditModal}>
          <AppText style={styles.menuListText}>Edit</AppText>
          <ArrowRight style={styles.forwardIcon} />
        </BottomSheetRow>
        <BottomSheetRow onPress={removeTextBox} isLastRow>
          <AppText style={styles.menuListText}>Delete</AppText>
          <ArrowRight style={styles.forwardIcon} />
        </BottomSheetRow>
      </BottomSheet>
      <AddResponsibilityModal
        currentSelectedText={isNewResponsibility ? '' : localResponsibilities[selectedResponsibilityIndex || 0]}
        closeIsEditModal={closeIsEditModal}
        addResponsibilityModalVisible={isEditModalOpen}
        setSelectedResponsibilityIndex={setSelectedResponsibilityIndex}
        upsertResponsibility={upsertResponsibility}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        title={backoutWithoutSavingTitle}
        subTitle={backoutWithoutSavingSubTitle}
        closeModal={closeAlertModal}
        onConfirmPress={closeModal}
      />

      <RedesignModalHeader
        title={`YOU'REF...`}
        goBackAction={onBackButtonPress}
        onSave={saveModal}
        isSaveDisabled={!hasSelectionChanged}
      />

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <AppText style={styles.topText}>
          This will be a of characteristics that will allow a candidate to excel in this role
        </AppText>
        <TouchableOpacity onPress={onAddItemPress} style={styles.addResponsibilityButton}>
          <AppBoldText style={styles.text}>ADD TO LIST</AppBoldText>
        </TouchableOpacity>

        {localResponsibilities?.length >= 0
          ? localResponsibilities.map((responsibility, index) => textBox(responsibility, index))
          : null}
      </ScrollView>
    </Modal>
  );
};

export default ResponsibilitiesModal;
