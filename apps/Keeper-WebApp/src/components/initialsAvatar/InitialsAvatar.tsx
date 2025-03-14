import { AlertModal, AppHeaderText, Clickable, KeeperModal } from 'components';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from 'services';
import { Link } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import useStyles from './InitialsAvatarStyles';
import { ResumeModal } from 'modals';

type InitialsAvatarProps = {
  currentPath: string;
};

// this pages only purpose to to see if the user is logged in or not and redirect them to the right place
// it also does loadInitialData which goes and gets the users data from database, sets it in redux then navigates to correct place
const InitialsAvatar = ({ currentPath }: InitialsAvatarProps) => {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isResumeModalVisible, setIsResumeModalVisible] = useState(false);

  const { logOut, resetReduxData } = useAuth();

  const styles = useStyles(currentPath);

  useEffect(() => {
    closeAccountModal();
    closeAlertModal();
  }, [isResumeModalVisible]);

  const closeAccountModal = useCallback(() => {
    setIsAccountModalOpen(false);
  }, []);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const openAlertModal = useCallback(() => {
    setIsAlertModalOpen(true);
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      await Auth.deleteUser();
    } catch (error) {
      console.error('error', error);
    }

    logOut();
    resetReduxData();
  }, [logOut, resetReduxData]);

  const returnUiBasedOnProfileCompletion = () => {
    return (
      <div style={styles.navItem} onClick={() => setIsAccountModalOpen(true)}>
        <AppHeaderText style={{ ...styles.navText, ...styles.logInNavText }}>Settings</AppHeaderText>
      </div>
    );
  };

  const onYourResumeClick = () => {
    setIsResumeModalVisible(true);
    closeAccountModal();
  };

  return (
    <>
      <AlertModal
        isOpen={isAlertModalOpen}
        title='Are you sure you want to delete your account?'
        subTitle='This is irreversible and will log you out'
        closeModal={closeAlertModal}
        onConfirmPress={deleteAccount}
      />
      <ResumeModal isVisible={isResumeModalVisible} setIsVisible={setIsResumeModalVisible} />
      <KeeperModal isOpen={isAccountModalOpen} closeModal={closeAccountModal} modalStyles={styles.keeperModal}>
        <Clickable style={styles.modalItem} onClick={() => setIsResumeModalVisible(true)}>
          <AppHeaderText style={styles.modalItemText}>Your Resume</AppHeaderText>
        </Clickable>
        <Clickable style={styles.modalItem} onClick={logOut}>
          <AppHeaderText style={styles.modalItemText}>Log Out</AppHeaderText>
        </Clickable>
        <Clickable style={styles.modalItem} onClick={openAlertModal}>
          <AppHeaderText style={styles.modalItemText}>Delete Account</AppHeaderText>
        </Clickable>
      </KeeperModal>

      {returnUiBasedOnProfileCompletion()}
    </>
  );
};

export default InitialsAvatar;
