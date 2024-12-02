/* eslint-disable no-undef */
import React, { useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBoldText,
  AppHeaderText,
  BottomSheet,
  HideBottomNavScrollView,
  JobPostingComponent,
  RedesignHeader,
} from 'components';
import { RootState, addLoggedInUser } from 'reduxStore';
import { TJob } from 'types';
import Icon from 'react-native-vector-icons/Feather';
import { UsersService } from 'services';

import { useStyles } from './JobPostingStyles';

type JobPostingProps = {
  swipe: (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => Promise<void>;
  currentJob: TJob;
  setLikedCard: any;
};

// this is the screen that is used in the employees discover page
// that shows job posting that the employee can swipe on
const JobPosting = ({ currentJob, swipe, setLikedCard }: JobPostingProps) => {
  const bottomNavBarHeight = useSelector((state: RootState) => state.local.bottomNavBarHeight);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const hasSeenFirstLikeAlert = useSelector((state: RootState) => state.loggedInUser.hasSeenFirstLikeAlert);

  const [isFirstLikeModalOpen, setIsFirstLikeModalOpen] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(bottomNavBarHeight, isEmployeeNew);

  const closeFirstLikeBottomSheet = useCallback(() => {
    dispatch(addLoggedInUser({ hasSeenFirstLikeAlert: true }));
    UsersService.updateUserData({
      userId: loggedInUserId || '',
      accountType,
      updateObject: { hasSeenFirstLikeAlert: true },
    });
    if (swipe) {
      swipe(true, currentJob._id || '');
    }
  }, [accountType, currentJob._id, dispatch, loggedInUserId, swipe]);

  const onKeepButtonPress = useCallback(
    (isLike: boolean) => {
      if (!hasSeenFirstLikeAlert && isLoggedIn && isLike) {
        setIsFirstLikeModalOpen(true);
        setLikedCard(isLike);
      } else if (swipe) {
        swipe(isLike, currentJob._id || '');
        setLikedCard(isLike);
      }
    },
    [currentJob._id, hasSeenFirstLikeAlert, isLoggedIn, setLikedCard, swipe],
  );

  return (
    <>
      <View style={styles.jobPostingContainer}>
        <BottomSheet isOpen={isFirstLikeModalOpen} closeModal={closeFirstLikeBottomSheet} rowNumber={2}>
          <AppHeaderText style={styles.ranOutOfLikesText}>
            Pressing like sends a notification to the recruiter with your profile. Be alert for a message back soon!
          </AppHeaderText>
        </BottomSheet>
        <HideBottomNavScrollView>
          <RedesignHeader title='Jobs' containerStyles={styles.noBottomBorder} titleStyles={styles.titleStyles} />

          <View style={styles.jobPosting}>
            <JobPostingComponent currentJobSettings={currentJob.settings} />
          </View>
        </HideBottomNavScrollView>
        <View style={styles.xOrNextButtonContainer}>
          <TouchableOpacity onPress={() => onKeepButtonPress(false)} style={styles.browseNextButton}>
            <AppBoldText style={styles.browseNextText}>Pass</AppBoldText>
            <Icon name='x' size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onKeepButtonPress(true)} style={styles.browseNextButton}>
            <AppBoldText style={styles.browseNextText}>Like</AppBoldText>
            <Icon name='check' size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default JobPosting;
