import React, { useState } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { KeeperTextInput, RedesignModalHeader } from 'components';
import { useDidMountEffect } from 'hooks';

import { useStyles } from './AddResponsibilitiesModalStyles';

type AddResponsibilityProps = {
  currentSelectedText: string;
  closeIsEditModal: () => void;
  addResponsibilityModalVisible: boolean;
  setSelectedResponsibilityIndex: (index: any) => void;
  upsertResponsibility: (responsibility: string) => void;
};

const AddResponsibility = ({
  currentSelectedText,
  closeIsEditModal,
  addResponsibilityModalVisible,
  setSelectedResponsibilityIndex,
  upsertResponsibility,
}: AddResponsibilityProps) => {
  const [newResponsibilityText, setNewResponsibilityText] = useState(currentSelectedText || '');
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();

  useDidMountEffect(() => {
    setNewResponsibilityText(currentSelectedText);
    if (addResponsibilityModalVisible) {
      setHasSelectionChanged(false);
    }
  }, [currentSelectedText, addResponsibilityModalVisible]);

  const onTextChange = (updatedText: string) => {
    setHasSelectionChanged(true);
    setNewResponsibilityText(updatedText);
  };

  const saveResponsibility = () => {
    if (newResponsibilityText) {
      upsertResponsibility(newResponsibilityText);
    }
    closeModal();
  };

  const closeModal = () => {
    setHasSelectionChanged(false);
    closeIsEditModal();
    setSelectedResponsibilityIndex(null);
    setNewResponsibilityText('');
  };

  return (
    <Modal
      animationIn='slideInRight'
      animationOut='slideOutRight'
      style={styles.modal}
      isVisible={addResponsibilityModalVisible}>
      <RedesignModalHeader
        title='ADD ONE TO LIST'
        goBackAction={closeModal}
        onSave={saveResponsibility}
        isSaveDisabled={!hasSelectionChanged}
      />

      <View style={styles.textInputContainer}>
        <KeeperTextInput
          value={newResponsibilityText}
          onChangeText={onTextChange}
          style={styles.textInput}
          multiline
          autoFocus
        />
      </View>
    </Modal>
  );
};

export default AddResponsibility;
