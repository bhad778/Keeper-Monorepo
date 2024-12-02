import { useCallback, useEffect, useState } from 'react';
import {
  AlertModal,
  AppHeaderText,
  Clickable,
  KeeperSelectButton,
  KeeperTextInput,
  ViewCoreSignalUsers,
} from 'components';
import { MiscService, UsersService } from 'services';
import { TCoreSignalSearchFilters, TCoreSignalUserData } from 'types/employeeTypes';
import { LoadingScreen } from 'screens';
import { RootState, addLoggedInUser } from 'reduxStore';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { genericErrorMessage } from 'constants/globalConstants';

import { useStyles } from './NameAndCompanyStyles';

const NameAndCompany = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coreSignalUsers, setCoreSignalUsers] = useState<TCoreSignalUserData[]>();
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(isValid);

  useEffect(() => {
    if (fullName && companyName.length > 2) {
      setIsValid(true);
    }
  }, [companyName.length, fullName]);

  const onSubmitClick = useCallback(async () => {
    if (numberOfTries < 2) {
      setIsLoading(true);
      const corSignalFilterObject: TCoreSignalSearchFilters = {
        fullName,
        companyName,
      };
      try {
        const coreSignalUsers = await MiscService.searchAndCollectCoreSignal(corSignalFilterObject);
        if (coreSignalUsers.length > 0) {
          setCoreSignalUsers(coreSignalUsers);
        } else {
          if (numberOfTries === 0) {
            toast.error("We couldn't find your profile. Please try again or skip ahead to fill out profile manually.");
          } else if (numberOfTries >= 1) {
            setIsAlertModalOpen(true);
          }
        }
        setNumberOfTries((prev) => prev + 1);
      } catch (error) {
        console.error('searchCoreSignal error: ', error);
        toast.error(genericErrorMessage);
      }
      setIsLoading(false);
    } else {
      setIsAlertModalOpen(true);
    }
  }, [companyName, fullName, numberOfTries]);

  const skipCoreSignal = async () => {
    try {
      setIsLoading(true);
      // update backend with hasGottenToEditProfileScreen
      await UsersService.updateUserData({
        userId: loggedInUserId || '',
        accountType: 'employee',
        updateObject: { hasGottenToEditProfileScreen: true },
      });
      dispatch(addLoggedInUser({ hasGottenToEditProfileScreen: true }));
    } catch (error) {
      toast.error(genericErrorMessage);
      console.error('error: ', error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AlertModal
        isOpen={isAlertModalOpen}
        title="We couldnt find your job history!"
        subTitle="Let's take you to fill your profile manually"
        isOkButton
        closeModal={skipCoreSignal}
      />
      {coreSignalUsers && coreSignalUsers.length > 0 ? (
        <ViewCoreSignalUsers coreSignalUsers={coreSignalUsers} />
      ) : (
        <div style={styles.container}>
          <AppHeaderText style={styles.titleText}>Let's find your job history.</AppHeaderText>
          <KeeperTextInput
            value={fullName}
            label="Full Name"
            inputStyles={styles.textInputStyles}
            labelStyles={styles.textInputHeader}
            containerStyles={styles.textInputContainer}
            onChange={setFullName}
          />
          <KeeperTextInput
            value={companyName}
            label="A Past or Current Company"
            inputStyles={styles.textInputStyles}
            labelStyles={styles.textInputHeader}
            containerStyles={styles.textInputContainer}
            onChange={setCompanyName}
          />

          <KeeperSelectButton
            disabled={!isValid}
            title="Submit"
            onClick={onSubmitClick}
            buttonStyles={styles.submitButton}
            textStyles={styles.submitButtonText}
          />

          <Clickable onClick={skipCoreSignal} style={styles.bottomTextContainer}>
            <AppHeaderText style={styles.bottomText}>
              Seeking your first job? Skip to manually enter profile.
            </AppHeaderText>
          </Clickable>
        </div>
      )}
    </>
  );
};

export default NameAndCompany;
