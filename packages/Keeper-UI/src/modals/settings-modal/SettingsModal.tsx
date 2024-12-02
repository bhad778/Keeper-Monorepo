import { AppText, KeeperModal, AppBoldText } from 'components';
import { AlertModal } from 'modals';
import React, { useCallback } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { useAuth } from 'services';
import { useNavigation } from '@react-navigation/native';

import ArrowRightBlack from '../../assets/svgs/arrow_right_black.svg';
import { useStyles } from './SettingsModalStyles';

type SettingsModalProps = {
  isKeeperProModalOpen: boolean;
  isSettingsModalOpen: boolean;
  closeSettings: () => void;
  closeKeeperProModal: () => void;
  onKeeperProPress: () => void;
};

const SettingsModal = ({
  isKeeperProModalOpen,
  isSettingsModalOpen,
  closeSettings,
  closeKeeperProModal,

  onKeeperProPress,
}: SettingsModalProps) => {
  const navigation = useNavigation();
  const { logOut, resetReduxData } = useAuth();
  const styles = useStyles();

  const logOutAndNavigate = useCallback(async () => {
    navigation.navigate('AccountType');
    resetReduxData();
    await logOut();
  }, [logOut, navigation, resetReduxData]);

  const onDeleteAccountPress = useCallback(() => {
    Alert.alert('Are you sure you want to delete your account?', 'This is irreversible and will log you out', [
      {
        text: 'Cancel',
        onPress: () => console.error('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          Auth.deleteUser();
          logOutAndNavigate();
        },
      },
    ]);
  }, [logOutAndNavigate]);

  return (
    <KeeperModal
      isModalOpen={isSettingsModalOpen}
      closeModal={closeSettings}
      modalStyles={styles.settingsModalContainer}>
      <>
        <AlertModal
          isOpen={isKeeperProModalOpen}
          title='Coming Soon!'
          subTitle='Keeper Pro is under works and will be ready soon.'
          closeModal={closeKeeperProModal}
          onConfirmPress={closeKeeperProModal}
          isOkButton
        />
        <TouchableOpacity style={styles.row} onPress={logOutAndNavigate}>
          <AppText style={styles.text}>Log Out</AppText>
          <ArrowRightBlack style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpCenterRow} onPress={onDeleteAccountPress}>
          <AppText style={styles.text}>Delete Account</AppText>
          <ArrowRightBlack style={styles.arrowIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.keeperProButton} onPress={onKeeperProPress}>
          <AppBoldText style={styles.keeperProButtonText}>Get Keeper Pro</AppBoldText>
        </TouchableOpacity>
      </>
    </KeeperModal>
  );
};

export default SettingsModal;
