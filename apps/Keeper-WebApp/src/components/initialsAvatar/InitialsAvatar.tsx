import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { AlertModal, AppHeaderText, Clickable, KeeperModal } from 'components';
import { useCallback, useState } from 'react';
import { useAuth } from 'services';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import CogIcon from 'assets/svgs/settingsIconWhite.svg?react';

import useStyles from './InitialsAvatarStyles';

// this pages only purpose to to see if the user is logged in or not and redirect them to the right place
// it also does loadInitialData which goes and gets the users data from database, sets it in redux then navigates to correct place
const InitialsAvatar = () => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const { logOut, resetReduxData } = useAuth();

  const styles = useStyles();
  const navigate = useNavigate();

  const openAccountModal = useCallback(() => {
    setIsAccountModalOpen(true);
  }, []);

  const closeAccountModal = useCallback(() => {
    setIsAccountModalOpen(false);
  }, []);

  const onSignUpClick = useCallback(() => {
    navigate('/phoneNumber');
  }, [navigate]);

  const onLoginClick = useCallback(() => {
    navigate('/phoneNumber', { state: { isLogIn: true } });
  }, [navigate]);

  const closeAlertModal = useCallback(() => {
    setIsAlertModalOpen(false);
  }, []);

  const openAlertModal = useCallback(() => {
    setIsAlertModalOpen(true);
  }, []);

  const deleteAccount = useCallback(async () => {
    try {
      const response = await Auth.deleteUser();
    } catch (error) {
      console.error('error', error);
    }

    logOut();
    resetReduxData();
  }, [logOut, resetReduxData]);

  const returnUiBasedOnProfileCompletion = () => {
    if (isLoggedIn) {
      return (
        <Clickable style={styles.container} onClick={openAccountModal}>
          <CogIcon width={34} />
        </Clickable>
      );
    } else {
      return (
        <Clickable onClick={onLoginClick}>
          <AppHeaderText style={styles.signUpText}>Log In</AppHeaderText>
        </Clickable>
      );
    }
  };

  return (
    <>
      <AlertModal
        isOpen={isAlertModalOpen}
        title="Are you sure you want to delete your account?"
        subTitle="This is irreversible and will log you out"
        closeModal={closeAlertModal}
        onConfirmPress={deleteAccount}
      />
      <KeeperModal isOpen={isAccountModalOpen} closeModal={closeAccountModal} modalStyles={styles.keeperModal}>
        <Clickable style={styles.modalItem} onClick={logOut}>
          <AppHeaderText style={styles.modalItemText}>Log Out</AppHeaderText>
        </Clickable>
        <Clickable style={styles.modalItem} onClick={openAlertModal}>
          <AppHeaderText style={styles.modalItemText}>Delete Account</AppHeaderText>
        </Clickable>
        {/* <Clickable style={styles.modalItem} onClick={logOut}>
          <AppHeaderText style={styles.modalItemText}>Get Keeper Pro</AppHeaderText>
        </Clickable> */}
      </KeeperModal>

      {returnUiBasedOnProfileCompletion()}
    </>
  );
};

export default InitialsAvatar;
