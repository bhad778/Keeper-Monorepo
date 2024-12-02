import { useDispatch, useSelector } from 'react-redux';
import { TEmployee, TJob, TSwipe } from 'types';
import { TouchableOpacity, View } from 'react-native';
import { RootState, removeFromReceivedLikesById } from 'reduxStore';
import {
  AppBoldText,
  AppText,
  BackButton,
  HideBottomNavScrollView,
  JobPostingComponent,
  KeeperModal,
  Match,
  ResumeComponent,
} from 'components';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useTheme } from 'theme/theme.context';
import { useMatch } from 'hooks';
import { JobsService, UsersService } from 'services';

import { useStyles } from './UsersThatLikedYouListStyles';
import { getMatchesContainerHeight } from 'utils';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

type TUsersThatLikedYouList = {
  usersThatLikedYou: TEmployee[] & TJob[];
  getJobThatReceivedThisLike: (employeeId: string) => void;
  setCurrentTabIndex: (index: number) => void;
};

const UsersThatLikedYouList = ({
  usersThatLikedYou,
  getJobThatReceivedThisLike,
  setCurrentTabIndex,
}: TUsersThatLikedYouList) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const employeeReceivedLikes = useSelector((state: RootState) => state.loggedInUser.receivedLikes);

  const [userProfileToView, setUserProfileToView] = useState<TEmployee & TJob>();

  const isEmployee = accountType === 'employee';

  const styles = useStyles(usersThatLikedYou.length);
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { createMatch } = useMatch();
  const dispatch = useDispatch();

  const closeModal = () => {
    setUserProfileToView(undefined);
  };

  // backend returns settings with Id added in just for this purpose
  const onItemPress = useCallback((userData: TEmployee & TJob) => {
    setUserProfileToView(userData);
  }, []);

  const onLike = useCallback(
    (userData: TEmployee & TJob, jobThatGotLiked?: TJob) => {
      closeModal();
      createMatch(userData, jobThatGotLiked);
      dispatch(
        removeFromReceivedLikesById({
          idToRemove: userData._id || '',
          jobIdToRemoveReceivedLikeFrom: jobThatGotLiked?._id || '',
        }),
      );

      // record swipe because this user shouldnt see this person in the feed after this
      const newSwipe: TSwipe & {
        accountType: string;
        isMatch: boolean;
        jobOwnerId?: string;
      } = {
        ownerId: isEmployee ? loggedInUserId : jobThatGotLiked?._id,
        jobOwnerId: isEmployee ? userData.ownerId : '',
        isRightSwipe: false,
        receiverId: userData._id,
        createdOnWeb: true,
        timeStamp: new Date(),
        accountType,
        isMatch: false,
      };
      UsersService.recordSwipe(newSwipe);

      setCurrentTabIndex(0);
      Toast.show({
        type: 'success',
        text1: `You got a match!`,
        position: 'bottom',
        visibilityTime: 1500,
      });
    },
    [accountType, createMatch, dispatch, isEmployee, loggedInUserId, setCurrentTabIndex],
  );

  const onDislike = useCallback(
    (userData: TEmployee & TJob, jobThatGotLiked?: TJob) => {
      closeModal();

      // remove receivedLike in redux
      dispatch(
        removeFromReceivedLikesById({
          idToRemove: userData._id || '',
          jobIdToRemoveReceivedLikeFrom: jobThatGotLiked?._id || '',
        }),
      );

      // begin update DB with removedReceivedLike
      // you dont need to do this for onLike because createMatch does it
      const idToRemove = userData._id || '';
      const jobIdToRemoveReceivedLikeFrom = jobThatGotLiked?._id || '';

      // get the updated receivedLikes for job or employee
      let updatedReceivedLikes = [];
      if (jobIdToRemoveReceivedLikeFrom && employersJobs) {
        const tempEmployersJobs = [...employersJobs];

        const index = tempEmployersJobs.findIndex(job => job._id === jobIdToRemoveReceivedLikeFrom);

        let tempReceivedLikes = [...tempEmployersJobs[index].receivedLikes];

        tempReceivedLikes = tempReceivedLikes.filter(id => id !== idToRemove);

        updatedReceivedLikes = tempReceivedLikes;
      } else {
        const tempReceivedLikes = [...employeeReceivedLikes];

        updatedReceivedLikes = tempReceivedLikes.filter(id => id !== idToRemove);
      }

      if (isEmployee) {
        UsersService.updateUserData({
          userId: loggedInUserId || '',
          accountType: 'employee',
          updateObject: { receivedLikes: updatedReceivedLikes },
        });
      } else {
        JobsService.updateJobData({
          jobId: jobThatGotLiked?._id || '',
          updateObject: { receivedLikes: updatedReceivedLikes },
        });
      }
      // end update DB with removedReceivedLike

      // record swipe because this user shouldnt see this person in the feed after this
      const newSwipe: TSwipe & {
        accountType: string;
        isMatch: boolean;
        jobOwnerId?: string;
      } = {
        ownerId: isEmployee ? loggedInUserId : jobThatGotLiked?._id,
        jobOwnerId: isEmployee ? userData.ownerId : '',
        isRightSwipe: false,
        receiverId: userData._id,
        createdOnWeb: true,
        timeStamp: new Date(),
        accountType,
        isMatch: false,
      };
      UsersService.recordSwipe(newSwipe);

      Toast.show({
        type: 'success',
        text1: `Successfully removed from your likes page`,
        position: 'bottom',
        visibilityTime: 1500,
      });
    },
    [accountType, dispatch, employeeReceivedLikes, employersJobs, isEmployee, loggedInUserId],
  );

  const returnUsersThatLikedYouListItems = () => {
    if (usersThatLikedYou.length > 0) {
      return usersThatLikedYou.map(userData => {
        if (isEmployee) {
          return (
            <Match
              isEmployee={isEmployee}
              isCandidateSort
              text={userData.settings.companyDescription || ''}
              img={userData.settings.img || ''}
              color={theme.color.pink}
              title={userData.settings.title || ''}
              onPress={() => onItemPress(userData)}
            />
          );
        } else {
          const jobThatReceivedThisLike = getJobThatReceivedThisLike(userData._id || '');

          return (
            <Match
              isEmployee={isEmployee}
              isCandidateSort
              text={userData.settings.aboutMeText || ''}
              img={userData.settings.img || ''}
              color={jobThatReceivedThisLike?.color}
              title={userData.settings.firstName || ''}
              onPress={() => onItemPress(userData)}
            />
          );
        }
      });
    } else {
      return [1, 2, 3, 4].map((item, index) => {
        return <View style={styles.blankChannelListItem} key={index} />;
      });
    }
  };

  const onLikePress = () => {
    if (isEmployee) {
      onLike(userProfileToView);
    } else {
      const jobThatReceivedThisLike = getJobThatReceivedThisLike(userProfileToView?._id || '');
      onLike(userProfileToView, jobThatReceivedThisLike);
    }
  };

  const onDislikePress = () => {
    if (isEmployee) {
      onDislike(userProfileToView);
    } else {
      const jobThatReceivedThisLike = getJobThatReceivedThisLike(userProfileToView?._id || '');
      onDislike(userProfileToView, jobThatReceivedThisLike);
    }
  };

  return (
    <>
      <KeeperModal isModalOpen={!!userProfileToView} closeModal={closeModal} modalStyles={styles.modalStyles}>
        <BackButton goBackAction={closeModal} touchableContainerStyles={styles.backButton} />
        <ScrollView>
          {isEmployee ? (
            <JobPostingComponent currentJobSettings={userProfileToView?.settings} isModal />
          ) : (
            <ResumeComponent currentEmployeeSettings={userProfileToView?.settings} isModal shouldTextBeWhite />
          )}
        </ScrollView>
        <View style={styles.xOrNextButtonContainer}>
          <TouchableOpacity onPress={onDislikePress} style={styles.browseNextButton}>
            <AppBoldText style={styles.browseNextText}>Pass</AppBoldText>
            <Icon name='x' size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onLikePress} style={styles.browseNextButton}>
            <AppBoldText style={styles.browseNextText}>Like</AppBoldText>
            <Icon name='check' size={30} />
          </TouchableOpacity>
        </View>
      </KeeperModal>
      <View style={[styles.customChannelListWrapper, { height: getMatchesContainerHeight(usersThatLikedYou.length) }]}>
        <View style={styles.customChannelList}>{returnUsersThatLikedYouListItems()}</View>
      </View>
    </>
  );
};

export default UsersThatLikedYouList;
