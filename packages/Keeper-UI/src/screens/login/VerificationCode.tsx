import React, { useState } from 'react';
import { View, TextInput, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import * as SecureStore from 'expo-secure-store';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addLoggedInUser, setSwipingDataRedux } from 'reduxStore';
import { UsersService } from 'services';
import { KeeperSpinnerOverlay, AppBoldText, KeeperSelectButton, BackButton } from 'components';
import { TEmployee, TLoggedInUserData } from 'types';

import useStyles from './VerificationCodeStyles';

const VerificationCode = () => {
  const [isValid, setIsValid] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isPhoneNumberCallLoading, setIsPhoneNumberCallLoading] = useState(false);

  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const styles = useStyles(isValid);

  const { phoneNumber, signInResponse, isFromBottomTabNav } = route.params;

  const save = async (key: any, value: any) => {
    await SecureStore.setItemAsync(key, value);
  };

  const onNextPress = async () => {
    signIn();
  };

  type TGetEmployeeData = {
    loggedInUserData: TLoggedInUserData;
    employeesForSwiping: TEmployee[];
  };

  const signIn = async () => {
    try {
      setIsPhoneNumberCallLoading(true);
      const confirmResponse = await Auth.confirmSignIn(signInResponse, verificationCode, 'SMS_MFA');
      const currentUserInfo = await Auth.currentUserInfo();
      Keyboard.dismiss();
      save('secretToken', confirmResponse.signInUserSession.accessToken.jwtToken);
      const isEmployer = currentUserInfo.attributes['custom:accountType'] === 'employer';
      if (isEmployer) {
        UsersService.getEmployerData({
          phoneNumber,
        })
          .then(({ loggedInUserData }: TGetEmployeeData) => {
            loggedInUserData.isLoggedIn = true;
            dispatch(addLoggedInUser(loggedInUserData));
            setIsPhoneNumberCallLoading(false);

            if (loggedInUserData.isNew) {
              navigation.navigate('Root', { screen: 'Job Board' });
            } else {
              navigation.navigate('Root', { screen: 'Discover' });
            }
          })
          .catch(error => {
            console.error(error);
            setIsPhoneNumberCallLoading(false);
          });
      } else {
        UsersService.getEmployeeData({
          phoneNumber,
        })
          .then(data => {
            dispatch(addLoggedInUser(data.loggedInUserData));
            if (!data.loggedInUserData.preferences.isNew) {
              dispatch(setSwipingDataRedux(data.jobsForSwiping));
            }
            setIsPhoneNumberCallLoading(false);
            dispatch(addLoggedInUser({ isLoggedIn: true }));
            navigation.navigate('Root');
          })
          .catch(error => {
            console.error('error signing in', error);
            setIsPhoneNumberCallLoading(false);
          });
      }
    } catch (error) {
      if (error.code == 'CodeMismatchException') {
        Toast.show({
          type: 'error',
          text1: 'Wrong error code',
          position: 'bottom',
          visibilityTime: 3000,
        });
      } else if (error.message == 'Invalid session for the user, session is expired.') {
        Toast.show({
          type: 'error',
          text1: 'Code expired',
          position: 'bottom',
          visibilityTime: 3000,
        });
      }
      console.error('error signing in', error);
      setIsPhoneNumberCallLoading(false);
    }
  };

  const onChangeVerificationCode = (value: any) => {
    setVerificationCode(value);
    if (value.length === 6) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  };
  return (
    <View style={styles.container}>
      {!isFromBottomTabNav && (
        <BackButton touchableContainerStyles={styles.backButton} iconStyles={styles.backButtonIcon} />
      )}
      <KeeperSpinnerOverlay isLoading={isPhoneNumberCallLoading} color='white' />

      <View style={styles.contents}>
        <View style={styles.iconTextContainer}>
          <AppBoldText style={styles.text}>Enter Verification Code</AppBoldText>
        </View>

        <TextInput
          style={styles.textInput}
          value={verificationCode}
          clearTextOnFocus={true}
          onChangeText={onChangeVerificationCode}
          keyboardType='numeric'
          autoComplete='one-time-code'
        />
        <KeeperSelectButton
          buttonStyles={styles.submitButton}
          textStyles={styles.submitText}
          disabled={!isValid}
          onPress={onNextPress}
          title='SUBMIT'
        />
      </View>
    </View>
  );
};

export default VerificationCode;
