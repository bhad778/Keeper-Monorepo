import React, { useState, useCallback } from 'react';
import { TextInput, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AppBoldText, BackButton, KeeperSelectButton } from 'components';
import { useDispatch } from 'react-redux';
import { addLoggedInUser } from 'reduxStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import useStyles from './NameStyles';

const Name = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const route = useRoute();
  const fromEducationSlide = route?.params?.fromEducationSlide;

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const styles = useStyles(isValid);

  const checkIfValid = useCallback(() => {
    if (firstName && lastName) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [firstName, lastName]);

  const onFirstNameChange = useCallback(
    (value: string) => {
      setFirstName(value);
      checkIfValid();
    },
    [checkIfValid],
  );

  const onLastNameChange = useCallback(
    (value: string) => {
      setLastName(value);
      checkIfValid();
    },
    [checkIfValid],
  );

  const onSubmitClick = useCallback(() => {
    dispatch(addLoggedInUser({ firstName, lastName }));
    navigation.navigate('PhoneNumber');
  }, [dispatch, firstName, lastName, navigation]);

  return (
    <View style={styles.container}>
      {fromEducationSlide && (
        <BackButton touchableContainerStyles={styles.backButton} iconStyles={styles.backButtonIcon} />
      )}
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAvoidingView} keyboardShouldPersistTaps='handled'>
        {/* <View style={styles.keeperLogoContainer}>
          <FullNameLogo style={styles.keeperLogo} />
        </View> */}
        <View style={styles.contents}>
          <View style={styles.iconTextContainer}>
            <AppBoldText style={styles.text}>Enter First Name</AppBoldText>
          </View>
          <TextInput
            style={styles.textInput}
            value={firstName}
            clearTextOnFocus={true}
            onChangeText={onFirstNameChange}
            autoCapitalize={'words'}
          />

          <View style={styles.iconTextContainer}>
            <AppBoldText style={styles.text}>Enter Last Name</AppBoldText>
          </View>
          <TextInput
            style={styles.textInput}
            value={lastName}
            clearTextOnFocus={true}
            autoCapitalize={'words'}
            onChangeText={onLastNameChange}
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
    </View>
  );
};

export default Name;
