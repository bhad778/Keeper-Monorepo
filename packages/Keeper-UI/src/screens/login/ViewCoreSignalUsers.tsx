import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { RootState, addLoggedInUser, updateResumeData } from 'reduxStore';
import { AppHeaderText, KeeperSpinnerOverlay, Match } from 'components';
import { TCoreSignalUserData } from 'types/employeeTypes';
import { jobColors } from 'constants';
import { coreSignalResumeTransformer } from 'utils';

import useStyles from './ViewCoreSignalUsersStyles';
import { UsersService } from 'services';
import Toast from 'react-native-toast-message';
import { genericErrorMessage } from 'constants/globalConstants';

type ViewCoreSignalUsersProps = {
  coreSignalUsers: TCoreSignalUserData[];
};

const ViewCoreSignalUsers = ({ coreSignalUsers }: ViewCoreSignalUsersProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(coreSignalUsers.length);

  const onSelectUserClick = useCallback(
    async (user: TCoreSignalUserData) => {
      setIsLoading(true);

      const updatedResumeData = coreSignalResumeTransformer(user);

      // call function to transform data, then set it in redux,
      // the employeeProfileScreen changes screens based on if hasGottenToEditProfileScreen exists
      dispatch(updateResumeData(updatedResumeData));
      dispatch(addLoggedInUser({ hasGottenToEditProfileScreen: true }));

      // update backend with hasGottenToEditProfileScreen
      UsersService.updateUserData({
        userId: loggedInUserId || '',
        accountType: 'employee',
        updateObject: { hasGottenToEditProfileScreen: true },
      });

      // update backend with updatedResume from core signal
      const updateObject = {
        userId: loggedInUserId || '',
        accountType: 'employee',
        lastUpdatedOnWeb: true,
        isIncomplete: true,
        newSettings: updatedResumeData,
      };
      UsersService.updateUserSettings(updateObject);

      setIsLoading(false);
    },
    [dispatch, loggedInUserId],
  );

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

  return (
    <View style={styles.container}>
      <KeeperSpinnerOverlay isLoading={isLoading} />

      <ScrollView style={styles.scrollView}>
        <AppHeaderText style={styles.headerText}>Select your profile.</AppHeaderText>
        <View style={styles.matchesContainer}>
          {coreSignalUsers.map((user: TCoreSignalUserData, index: number) => {
            return (
              <Match
                key={index}
                text={user.summary}
                img={user.logo_url}
                title={user.name}
                color={jobColors[index]}
                isEmployee={true}
                isCandidateSort={true}
                onPress={() => onSelectUserClick(user)}
              />
            );
          })}
        </View>
      </ScrollView>
      <TouchableOpacity onPress={skipCoreSignal} style={styles.bottomTextContainer}>
        <AppHeaderText style={styles.dontSeeProfileText}>Don&apos;t see your profile?</AppHeaderText>

        <AppHeaderText style={styles.bottomText}>Click here to fill out profile manually.</AppHeaderText>
      </TouchableOpacity>
    </View>
  );
};

export default ViewCoreSignalUsers;
