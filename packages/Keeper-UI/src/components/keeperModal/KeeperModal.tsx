/* eslint-disable no-undef */
import React, { memo } from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';

import { useStyles } from './KeeperModalStyles';

type KeeperModalProps = {
  children: any;
  isModalOpen: boolean;
  closeModal: any;
  modalStyles?: any;
};

const KeeperModal = ({ children, isModalOpen, closeModal, modalStyles }: KeeperModalProps) => {
  const styles = useStyles();

  return (
    <Modal avoidKeyboard isVisible={isModalOpen} onBackdropPress={closeModal}>
      <View style={[styles.modalContent, modalStyles]}>{children}</View>
    </Modal>
  );
};

export default memo(KeeperModal);
