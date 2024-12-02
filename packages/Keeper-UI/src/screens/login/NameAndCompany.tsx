import React, { useState, useCallback, useEffect } from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { AppBoldText, AppHeaderText, KeeperSelectButton } from 'components';
import { LoadingScreen, ViewCoreSignalUsers } from 'screens';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MiscService, UsersService } from 'services';
import { TCoreSignalSearchFilters, TCoreSignalUserData } from 'types/employeeTypes';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addLoggedInUser } from 'reduxStore';
import Toast from 'react-native-toast-message';
import { genericErrorMessage } from 'constants/globalConstants';
import useStyles from './NameAndCompanyStyles';
import { AlertModal } from 'modals';

const NameAndCompany = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [coreSignalUsers, setCoreSignalUsers] = useState<TCoreSignalUserData[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [numberOfTries, setNumberOfTries] = useState(0);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(isValid);

  useEffect(() => {
    if (fullName && companyName) {
      setIsValid(true);
    }
  }, [fullName, companyName]);

  // const onSubmitClick = useCallback(async () => {
  //   setIsLoading(true);
  //   const corSignalFilterObject: TCoreSignalSearchFilters = {
  //     fullName,
  //     companyName,
  //   };
  //   try {
  //     const coreSignalUsers = await MiscService.searchAndCollectCoreSignal(corSignalFilterObject);
  //     setCoreSignalUsers(coreSignalUsers);
  //   } catch (error) {
  //     console.error('searchCoreSignal error: ', error);
  //   }
  //   setIsLoading(false);
  // }, [companyName, fullName]);

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
        } else if (numberOfTries === 0) {
          Toast.show({
            type: 'success',
            text1: `We couldn't find your profile. Please try again or skip ahead to fill out profile manually.`,
            position: 'bottom',
            visibilityTime: 1500,
          });
        } else if (numberOfTries >= 1) {
          setIsAlertModalOpen(true);
        }
        setNumberOfTries(prev => prev + 1);
      } catch (error) {
        console.error('searchCoreSignal error: ', error);
        Toast.show({
          type: 'error',
          text1: genericErrorMessage,
          position: 'bottom',
          visibilityTime: 1500,
        });
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
      Toast.show({
        type: 'error',
        text1: genericErrorMessage,
        position: 'bottom',
        visibilityTime: 1500,
      });
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
        title='We couldnt find your job history!'
        subTitle="Let's take you to fill your profile manually"
        isOkButton
        closeModal={skipCoreSignal}
      />
      {coreSignalUsers && coreSignalUsers.length > 0 ? (
        <ViewCoreSignalUsers coreSignalUsers={coreSignalUsers} />
      ) : (
        <View style={styles.container}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.keyboardAvoidingView}
            keyboardShouldPersistTaps='handled'>
            <AppHeaderText style={styles.titleText}>Let&apos;s find your job history.</AppHeaderText>
            <View style={styles.contents}>
              <View style={styles.iconTextContainer}>
                <AppBoldText style={styles.text}>Full Name</AppBoldText>
              </View>
              <TextInput
                style={styles.textInput}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize={'words'}
              />

              <View style={styles.iconTextContainer}>
                <AppBoldText style={styles.text}>A Past Company</AppBoldText>
              </View>
              <TextInput
                style={styles.textInput}
                value={companyName}
                onChangeText={setCompanyName}
                autoCapitalize={'words'}
              />
              <KeeperSelectButton
                buttonStyles={styles.submitButton}
                textStyles={styles.submitText}
                disabled={!isValid}
                onPress={onSubmitClick}
                title='SUBMIT'
              />
            </View>
          </KeyboardAwareScrollView>
          <TouchableOpacity onPress={skipCoreSignal} style={styles.bottomTextContainer}>
            <AppHeaderText style={styles.bottomText}>
              Seeking your first job? Skip to manually enter profile.
            </AppHeaderText>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default NameAndCompany;
