import React, { useState } from 'react';
import { AppBoldText, AppText, KeeperImage, KeeperModal, KeeperSelectButton, KeeperTouchable } from 'components';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore/store';
import { useNavigation } from '@react-navigation/native';

import { useStyles } from './EducationModalStyles';

const EducationModal = () => {
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const isEmployee = accountType === 'employee';

  const [educationModalVisible, setEducationModalVisible] = useState(isEmployerNew && !isEmployee);

  const styles = useStyles();
  const navigation = useNavigation();

  const onEducationModalButtonPress = () => {
    setEducationModalVisible(false);
    navigation.navigate('Root', { screen: 'Sign Up' });
  };

  return (
    <KeeperModal
      isModalOpen={educationModalVisible}
      modalStyles={styles.modalStyles}
      closeModal={() => setEducationModalVisible(false)}>
      <View style={styles.headerTextContainer}>
        <AppBoldText style={styles.tapOnCardsText}>Tap Cards to Preview App </AppBoldText>
      </View>
      <AppBoldText style={styles.welcomeToKeeperText}>Welcome to Keeper</AppBoldText>
      <KeeperTouchable onPress={() => setEducationModalVisible(false)}>
        <KeeperImage style={styles.imageStyles} source={require('assets/images/educationImage.png')} />
      </KeeperTouchable>

      <AppText style={styles.keeperDescriptionText}>
        Keeper functions like a dating app to connect tech recruiters to software candidates. Post a job opening to get
        a tailored feed of candidates and gain access to our dev database.
      </AppText>
      <KeeperSelectButton onPress={onEducationModalButtonPress} title='Post Your First Job' />
    </KeeperModal>
  );
};

export default EducationModal;
