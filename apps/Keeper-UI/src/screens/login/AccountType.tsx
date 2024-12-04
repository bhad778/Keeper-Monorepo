import React, { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addLoggedInUser } from 'reduxStore';
import { warmUpEmployeeSignUp, warmUpEmployerSignUp, warmUpGetForSwiping } from 'projectUtils/globalUtils';
import { FullNameLogo } from 'keeperAssets';

import AppHeaderText from '../../components/AppHeaderText';
import useStyles from './AccountTypeStyles';

const AccountType = () => {
  const navigation = useNavigation();
  const styles = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    warmUpGetForSwiping();
  }, []);

  const finishSwiper = useCallback(() => {
    navigation.navigate('Root', { screen: 'Discover' });
  }, [navigation]);

  const onChangeAccountType = useCallback(
    (accountType: 'employee' | 'employer') => {
      if (accountType === 'employee') {
        warmUpEmployeeSignUp();
      } else if (accountType === 'employer') {
        warmUpEmployerSignUp();
      }

      dispatch(addLoggedInUser({ accountType }));
      // navigation.navigate('EducationSwiper');
      // finishSwiper(accountType);
    },
    [dispatch, finishSwiper],
  );

  const onLoginPress = useCallback(() => {
    navigation.navigate('PhoneNumber', {
      isLogIn: true,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.keeperLogoContainer}>{<FullNameLogo style={styles.keeperLogo} />}</View>
      <View style={styles.contents}>
        <View style={styles.headerTextContainer}>
          <AppHeaderText style={styles.headerText}>What will you be{'\n'} using Keeper for?</AppHeaderText>
        </View>
        <TouchableOpacity style={styles.jobTypeButton} onPress={() => onChangeAccountType('employee')}>
          <AppHeaderText style={styles.text}>LOOKING FOR JOBS</AppHeaderText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jobTypeButton} onPress={() => onChangeAccountType('employer')}>
          <AppHeaderText style={styles.text}>LOOKING TO HIRE</AppHeaderText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginTextContainer} onPress={onLoginPress}>
          <AppHeaderText style={styles.haveAccountText}>Already have an account?</AppHeaderText>
          <AppHeaderText style={styles.loginText}>Login</AppHeaderText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AccountType;
