import { useDispatch, useSelector } from 'react-redux';
import { TEmployee, TJob, TSwipe } from 'keeperTypes';
import { RootState, removeFromReceivedLikesById } from 'reduxStore';
import { JobPostingComponent, KeeperModal, Match, ResumeComponent, SubHeaderLarge, SubHeaderSmall } from 'components';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { useTheme } from 'theme/theme.context';
import { useMatch } from 'hooks';
import toast from 'react-hot-toast';

import { useStyles } from './UsersThatLikedYouListStyles';
import { JobsService, UsersService } from 'services';

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

  const styles = useStyles();
  const navigate = useNavigate();
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
      toast.success(`You got a match!`);
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

      // update it in DB, either on employee or job object

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

      toast.success(`Successfully removed from your likes page`);
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
      return (
        <div style={styles.blankChannelListItem}>
          <div style={styles.topOfBlankListItem}>
            <SubHeaderLarge
              textInputLabelStyle={{ textAlign: 'center' }}
              text='Keep Swiping to Get your Job in Front of More Candidates'
            />
          </div>
          <div
            onClick={() => navigate(isEmployee ? '/employeeHome/discover' : '/employerHome/jobBoard')}
            style={styles.bottomOfBlankListItem}>
            <SubHeaderSmall
              textInputLabelStyle={{ textAlign: 'center' }}
              text={!isEmployee ? 'Return to the Job Board to continue swiping' : 'Return to Discover to keep swiping '}
            />
          </div>
        </div>
      );
    }
  };

  return (
    <Grid container style={styles.customChannelListWrapper}>
      <KeeperModal isOpen={!!userProfileToView} closeModal={closeModal} modalStyles={styles.modalStyles}>
        {isEmployee ? (
          <JobPostingComponent
            currentJobSettings={userProfileToView?.settings}
            onLike={() => onLike(userProfileToView)}
            onDislike={() => onDislike(userProfileToView)}
            isModal
          />
        ) : (
          <ResumeComponent
            currentEmployeeSettings={userProfileToView?.settings}
            onLike={() => {
              const jobThatReceivedThisLike = getJobThatReceivedThisLike(userProfileToView._id || '');
              onLike(userProfileToView, jobThatReceivedThisLike);
            }}
            onDislike={() => {
              const jobThatReceivedThisLike = getJobThatReceivedThisLike(userProfileToView._id || '');
              onDislike(userProfileToView, jobThatReceivedThisLike);
            }}
            isModal
            shouldTextBeWhite
          />
        )}
      </KeeperModal>
      {returnUsersThatLikedYouListItems()}
    </Grid>
  );
};

export default UsersThatLikedYouList;
