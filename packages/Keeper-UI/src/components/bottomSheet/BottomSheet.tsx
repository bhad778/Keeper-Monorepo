import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import { KeeperSelectButton } from 'components';
import Icon from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';

import useStyles from './BottomSheetStyles';

type TBottomSheet = {
  children: React.ReactNode;
  closeModal: () => void;
  isOpen: boolean;
  // rowNumber is the height, measured in rows
  rowNumber: number;
  customButton?: { title: string; action: () => void };
  closeWithXButton?: boolean;
};

const BottomSheet = ({ children, closeModal, isOpen, customButton, rowNumber = 3, closeWithXButton }: TBottomSheet) => {
  //
  const styles = useStyles(rowNumber);

  return (
    <View style={styles.container}>
      <Modal style={styles.bottomModalView} isVisible={isOpen} onBackdropPress={closeModal}>
        <View style={styles.modal}>
          {closeWithXButton && (
            <TouchableOpacity onPress={closeModal} hitSlop={{ top: 60, right: 60, left: 60, bottom: 60 }}>
              <Icon name='x' size={30} style={styles.xIcon} />
            </TouchableOpacity>
          )}
          {children}
          {!closeWithXButton && (
            <KeeperSelectButton
              buttonStyles={styles.keepButtonLike}
              textStyles={styles.keepButtonTextLike}
              onPress={customButton ? customButton.action : closeModal}
              title={customButton ? customButton.title : 'CLOSE'}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default BottomSheet;
