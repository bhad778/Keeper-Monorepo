import React, { memo, useCallback, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  AppHeaderText,
  EmployerDiscoverHeader,
  HideBottomNavScrollView,
  ResumeComponent,
  BottomSheet,
} from 'components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reduxStore/store';
import { TEmployee } from 'types/employeeTypes';
import { addLoggedInUser } from 'reduxStore';
import { UsersService } from 'services';

import { useStyles } from './ResumeStyles';

type ResumeProps = {
  swipe: (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => Promise<void>;
  resumeScrollViewRef: any;
  setLikedCard: any;
  currentEmployee: TEmployee;
  isNew: boolean;
};

// this is the screen that is used in the employers discover page
// that shows resumes that employers can swipe on
const Resume = ({ swipe, currentEmployee, setLikedCard, isNew }: ResumeProps) => {
  const bottomNavBarHeight = useSelector((state: RootState) => state.local.bottomNavBarHeight);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const selectedJobColor = useSelector((state: RootState) => state.local.selectedJob.color);
  const hasSeenFirstLikeAlert = useSelector((state: RootState) => state.loggedInUser.hasSeenFirstLikeAlert);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const [isFirstLikeModalOpen, setIsFirstLikeModalOpen] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles(bottomNavBarHeight, isEmployerNew);

  const closeFirstLikeBottomSheet = useCallback(() => {
    dispatch(addLoggedInUser({ hasSeenFirstLikeAlert: true }));
    UsersService.updateUserData({
      userId: loggedInUserId || '',
      accountType,
      updateObject: { hasSeenFirstLikeAlert: true },
    });
    if (swipe) {
      swipe(true, currentEmployee._id || '');
    }
  }, [accountType, currentEmployee._id, dispatch, loggedInUserId, swipe]);

  const onKeepButtonPress = useCallback(
    (isLike: boolean) => {
      if (!hasSeenFirstLikeAlert && isLoggedIn && isLike) {
        setIsFirstLikeModalOpen(true);
        setLikedCard(isLike);
      } else if (swipe) {
        swipe(isLike, currentEmployee._id || '');
        setLikedCard(isLike);
      }
    },
    [currentEmployee._id, hasSeenFirstLikeAlert, isLoggedIn, setLikedCard, swipe],
  );

  return (
    <View style={styles.container}>
      <BottomSheet isOpen={isFirstLikeModalOpen} closeModal={closeFirstLikeBottomSheet} rowNumber={2}>
        <AppHeaderText style={styles.ranOutOfLikesText}>
          Pressing like sends a notification to the candidate about your job posting. Be alert for a message back soon!
        </AppHeaderText>
      </BottomSheet>
      <HideBottomNavScrollView currentEmployee={currentEmployee} style={styles.hideBottomNavScrollView}>
        <EmployerDiscoverHeader isNew={isNew} />
        <View style={styles.resume}>
          <ResumeComponent
            isOwner={false}
            currentEmployeeSettings={currentEmployee.settings}
            jobColor={selectedJobColor}
          />
        </View>
      </HideBottomNavScrollView>

      <View style={styles.xOrNextButtonContainer}>
        <TouchableOpacity onPress={() => onKeepButtonPress(false)} style={styles.likeDislikeButton}>
          <AppHeaderText style={styles.browseNextText}>Pass</AppHeaderText>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onKeepButtonPress(true)} style={styles.likeDislikeButton}>
          <AppHeaderText style={styles.browseNextText}>Like</AppHeaderText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(Resume);
