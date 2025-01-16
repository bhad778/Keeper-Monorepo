import React, { useCallback, useEffect, useState } from 'react';
import { TextInput, View, Keyboard } from 'react-native';
import { Auth } from 'aws-amplify';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AppBoldText, KeeperSelectButton, KeeperSpinnerOverlay, AppText, BackButton } from 'components';
import * as Sentry from 'sentry-expo';
import { UsersService } from 'keeperServices';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addLoggedInUser, setSwipingDataRedux } from 'reduxStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FullNameLogo } from 'keeperAssets';
import { CognitoUser } from 'amazon-cognito-identity-js';

import useStyles from './PhoneNumberStyles';

type RouteParams = {
  isLogIn?: boolean;
  isFromBottomTabNav?: boolean;
};

const PhoneNumber = () => {
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isPhoneNumberCallLoading, setIsPhoneNumberCallLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const styles = useStyles(isValid);

  const isLogIn = route?.params?.isLogIn;
  const isFromBottomTabNav = route?.params?.isFromBottomTabNav;
  const isEmployee = accountType === 'employee';

  useEffect(() => {
    checkIfValid();
  }, [email, phoneNumber]);

  const checkIfValid = useCallback(() => {
    if (isPhoneNumberValid && (email || isLogIn)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [email, isLogIn, isPhoneNumberValid]);

  const onChangePhoneNumber = (value: string) => {
    setPhoneNumber(normalizeInput(value));
    if (value.length <= 15 && value.length >= 14) {
      setIsPhoneNumberValid(true);
    } else {
      setIsPhoneNumberValid(false);
    }
  };

  const onChangeEmail = useCallback((value: string) => {
    setEmail(value);
  }, []);

  // this is just to pass the apple review
  const signInEmployeeAppleReview = async () => {
    setIsPhoneNumberCallLoading(true);
    UsersService.getEmployeeData({
      phoneNumber: '+17777777777',
    })
      .then(data => {
        dispatch(addLoggedInUser(data.loggedInUserData));
        dispatch(setSwipingDataRedux(data.jobsForSwiping));
        navigation.navigate('Root');
        setIsPhoneNumberCallLoading(false);
        dispatch(addLoggedInUser({ isLoggedIn: true }));
      })
      .catch(error => {
        console.error('error signing in', error);
        setIsPhoneNumberCallLoading(false);
      });
    setIsPhoneNumberCallLoading(false);
  };

  // this is just to pass the apple review
  const signInEmployerAppleReview = async () => {
    setIsPhoneNumberCallLoading(true);
    UsersService.getEmployerData({
      phoneNumber: '+18888888888',
    })
      .then(data => {
        dispatch(addLoggedInUser(data.loggedInUserData));
        dispatch(setSwipingDataRedux(data.employeesForSwiping));

        navigation.navigate('Root');
        setIsPhoneNumberCallLoading(false);
        dispatch(addLoggedInUser({ isLoggedIn: true }));
      })
      .catch(error => {
        console.error(error);
        setIsPhoneNumberCallLoading(false);
      });
    setIsPhoneNumberCallLoading(false);
  };

  const signIn = (numericPhoneNumber: string) => {
    Auth.signIn(numericPhoneNumber, 'Password$4')
      .then((signInResponse: CognitoUser) => {
        setIsPhoneNumberCallLoading(false);

        navigation.navigate('VerificationCode', { phoneNumber: numericPhoneNumber, signInResponse });
      })
      .catch((error: Error) => {
        setIsPhoneNumberCallLoading(false);

        if (error.message == 'Incorrect username or password.') {
          Toast.show({
            type: 'error',
            text1: 'You need to sign up first!',
            position: 'bottom',
            visibilityTime: 3000,
          });
        }

        setTimeout(() => {
          navigation.goBack();
        }, 1000);

        console.error(error);
      });
  };

  const signUp = async (numericPhoneNumber: string) => {
    // these custom attributes were created initially but later chosen to not be used,
    // it is tech debt to not require these eventually
    const stringifiedSignUpObject = {
      'custom:firstName': '',
      'custom:lastName': '',
      'custom:email': email,
      'custom:cityState': 'empty',
      'custom:accountType': accountType,
      'custom:relevantSkills': 'empty',
      'custom:yearsOfExp': '0',
      'custom:reqYearsOfExp': '0',
    };
    Auth.signUp({
      username: numericPhoneNumber,
      password: 'Password$4',
      attributes: stringifiedSignUpObject,
    })
      .then(() => {
        signIn(numericPhoneNumber);
      })
      .catch(error => {
        if (error.code == 'UsernameExistsException') {
          Toast.show({
            type: 'error',
            text1: 'Phone number already exists, try logging in',
            position: 'bottom',
            visibilityTime: 3000,
          });
        }
        console.error('error signing up:', error);
        setIsPhoneNumberCallLoading(false);
      });
  };

  const onNextButtonPress = async () => {
    dispatch(addLoggedInUser({ email }));

    const numericPhoneNumber = '+1' + phoneNumber.replace(/\D/g, '');

    Keyboard.dismiss();

    // if there is a sign up object, that means were signing up, else that means were just logging in
    if (isLogIn) {
      try {
        setIsPhoneNumberCallLoading(true);

        if (phoneNumber === '(777) 777-7777') {
          signInEmployeeAppleReview();
          return;
        }

        if (phoneNumber === '(888) 888-8888') {
          signInEmployerAppleReview();
          return;
        }
        signIn(numericPhoneNumber);
      } catch (error) {
        setIsPhoneNumberCallLoading(false);

        Sentry.Native.captureException(error);
      }
    } else {
      setIsPhoneNumberCallLoading(true);

      signUp(numericPhoneNumber);
    }

    // navigation.navigate('VerificationCode', { phoneNumber: numericPhoneNumber, signInResponse: true });
  };

  const normalizeInput = (value: any, previousValue?: any) => {
    if (!value) return value;
    const currentValue = value.replace(/[^\d]/g, '');
    const cvLength = currentValue.length;

    if (!previousValue || value.length > previousValue.length) {
      if (cvLength < 4) return currentValue;
      if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
      return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAvoidingView} keyboardShouldPersistTaps='handled'>
        {!isFromBottomTabNav && (
          <BackButton touchableContainerStyles={styles.backButton} iconStyles={styles.backButtonIcon} />
        )}
        <KeeperSpinnerOverlay isLoading={isPhoneNumberCallLoading} color='white' />

        <View style={styles.keeperLogoContainer}>
          <FullNameLogo style={styles.keeperLogo} />
        </View>

        <View style={styles.contents}>
          {!isEmployee && !isLogIn && (
            <View style={styles.createAJobTextContainer}>
              <AppText style={styles.createAJobText}>Sign up and Create a Job</AppText>
            </View>
          )}
          {!isLogIn && (
            <>
              <View style={styles.iconTextContainer}>
                <AppBoldText style={styles.titleText}>Enter Email</AppBoldText>
              </View>
              <TextInput
                style={styles.textInput}
                value={email}
                clearTextOnFocus={true}
                onChangeText={onChangeEmail}
                autoComplete='email'
                textContentType='emailAddress'
                textAlign='left'
              />
            </>
          )}

          <View style={styles.iconTextContainer}>
            <AppBoldText style={styles.titleText}>Enter Phone Number</AppBoldText>
            <AppText style={styles.subTitleText}>
              We use this only to send you a one time password and make sure all users have verified US phone numbers
            </AppText>
          </View>
          <TextInput
            style={styles.textInput}
            value={phoneNumber}
            clearTextOnFocus={true}
            onChangeText={onChangePhoneNumber}
            keyboardType='numeric'
            textAlign='left'
          />
          <KeeperSelectButton
            buttonStyles={styles.submitButton}
            textStyles={styles.submitText}
            disabled={!isValid}
            onPress={onNextButtonPress}
            title='SUBMIT'
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default PhoneNumber;
