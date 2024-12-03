import { RootState } from 'reduxStore/store';
import { useDispatch, useSelector } from 'react-redux';
import { TEmployee, TJob, TMatch } from 'keeperTypes';
import { ChannelList, AppText, AppHeaderText, UsersThatLikedYouList, SpinnerOverlay, WithBadge } from 'components';
import { Grid, Box, Tab, Tabs } from '@mui/material';
import SendMessages from 'components/sendMessages';
import { addLoggedInUser, setSelectedChannel } from 'reduxStore';
import { useCallback, useEffect, useState } from 'react';
import { CustomTabPanel } from 'components/customTabPanel/CustomTabPanel';
import { UsersService } from 'services';
import { useDidMountEffect } from 'hooks';
import { getMatchesFromEmployersJobs } from 'utils';

import useStyles from './MatchesStyles';

const Matches = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const employeeMatches = useSelector((state: RootState) => state.loggedInUser.matches);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const selectedChannel = useSelector((state: RootState) => state.local.selectedChannel);
  const hasReceivedLikeNotification = useSelector((state: RootState) => state.loggedInUser.hasReceivedLikeNotification);
  // needs to be different for employer
  const employeeReceivedLikes = useSelector((state: RootState) => state.loggedInUser.receivedLikes);

  const [isLoading, setIsLoading] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [usersThatLikedYou, setUsersThatLikedYou] = useState<TEmployee[] & TJob[]>([]);
  const [hasMatchNotification, setHasMatchNotification] = useState(false);
  const [matches, setMatches] = useState<TMatch[]>([]);

  const isEmployee = accountType === 'employee';

  const dispatch = useDispatch();
  const styles = useStyles(true);

  useEffect(() => {
    setMatches(isEmployee ? employeeMatches : getMatchesFromEmployersJobs(employersJobs || []));
  }, [employeeMatches, employersJobs, isEmployee]);

  useEffect(() => {
    let localHasNotification = false;
    matches?.map(match => {
      if (match?.custom.hasNotification) {
        localHasNotification = true;
      }
    });
    setHasMatchNotification(localHasNotification);
  }, [hasReceivedLikeNotification, matches]);

  useDidMountEffect(() => {
    // set it to employeeReceivedLikes by default and set it to job ones if they are an employer
    let tempReceivedLikes = [...employeeReceivedLikes];
    if (!isEmployee) {
      const receivedLikedForJobs: string[] = [];
      employersJobs?.forEach(job => {
        receivedLikedForJobs.push(...job.receivedLikes);
      });
      tempReceivedLikes = receivedLikedForJobs;
    }

    // every time tab changes if you have receivedLikes go get data
    if (currentTabIndex === 1) {
      if (tempReceivedLikes.length > 0) {
        getUsersThatLikedYou(tempReceivedLikes);

        // update redux hasReceivedLikeNotification
        dispatch(addLoggedInUser({ hasReceivedLikeNotification: false }));
        // update backend hasReceivedLikeNotification to false
        UsersService.updateUserData({
          userId: loggedInUserId || '',
          accountType: isEmployee ? 'employee' : 'employer',
          updateObject: { hasReceivedLikeNotification: false },
        });
      } else {
        setUsersThatLikedYou([]);
      }
    }
  }, [currentTabIndex, employeeReceivedLikes, isEmployee, employersJobs]);

  const getUsersThatLikedYou = (likesIds: string[]) => {
    setIsLoading(true);
    if (!isLoading) {
      UsersService.getUsersByArrayOfIds({ userIdsArray: likesIds, isEmployee }).then(res => {
        setUsersThatLikedYou(res);
        setIsLoading(false);
      });
    }
  };

  const getJobThatReceivedThisLike = useCallback(
    (employeeId: string) => {
      let jobThatReceivedLike: TJob;
      employersJobs?.forEach(job => {
        if (job.receivedLikes.includes(employeeId)) {
          jobThatReceivedLike = job;
        }
      });
      return jobThatReceivedLike;
    },
    [employersJobs],
  );

  // useEffect(() => {

  // }, []);

  const setSelectedChannelRedux = useCallback(
    (newValue: TMatch | undefined) => {
      dispatch(setSelectedChannel(newValue));
    },
    [dispatch],
  );

  const returnSortByCandidateView = useCallback(() => {
    let matches: TMatch[] = [];
    if (isEmployee) {
      matches = employeeMatches ? [...employeeMatches] : [];
    } else {
      employersJobs?.map((job: TJob) => {
        const tempMatches = job.matches ? [...job.matches] : [];
        tempMatches.map((match: TMatch) => {
          const tempMatch = { ...match };
          tempMatch.custom = {
            ...tempMatch.custom,
            jobId: job._id,
            jobColor: job.color,
            jobTitle: job.settings.title,
            jobImg: job.settings.img,
            companyName: job.settings.companyName,
          };
          matches.push(tempMatch);
        });
      });
    }

    return (
      <div style={styles.candidatesChannelListWrapper}>
        {matches.length < 1 && (
          <div style={styles.noMatchesTextContainer}>
            <AppText style={styles.text}>No matches yet. Continue connecting to start a conversation.</AppText>
          </div>
        )}

        <ChannelList
          isAChannelSelected={!!selectedChannel}
          matches={matches}
          isCandidateSort={true}
          setSelectedChannel={setSelectedChannelRedux}
        />
      </div>
    );
  }, [
    employeeMatches,
    employersJobs,
    isEmployee,
    selectedChannel,
    setSelectedChannelRedux,
    styles.candidatesChannelListWrapper,
    styles.noMatchesTextContainer,
    styles.text,
  ]);

  const returnUsersThatLikedYou = useCallback(() => {
    const noLikesText = isEmployee
      ? 'No jobs have liked your profile yet. Keep swiping!'
      : 'No candidates have liked any of your jobs yet. Keep swiping!';

    if (isLoading) {
      return <SpinnerOverlay />;
    } else {
      return (
        <div style={styles.candidatesChannelListWrapper}>
          {usersThatLikedYou.length < 1 && (
            <div style={styles.noMatchesTextContainer}>
              <AppText style={styles.text}>{noLikesText}</AppText>
            </div>
          )}

          <UsersThatLikedYouList
            usersThatLikedYou={usersThatLikedYou}
            setCurrentTabIndex={setCurrentTabIndex}
            getJobThatReceivedThisLike={getJobThatReceivedThisLike}
          />
        </div>
      );
    }
  }, [
    getJobThatReceivedThisLike,
    isEmployee,
    isLoading,
    styles.candidatesChannelListWrapper,
    styles.noMatchesTextContainer,
    styles.text,
    usersThatLikedYou,
  ]);

  const closeSendMessages = useCallback(() => {
    dispatch(setSelectedChannel(undefined));
  }, [dispatch]);

  const returnSendMessages = useCallback(() => {
    return (
      <SendMessages
        channel={selectedChannel}
        senderId={isEmployee ? loggedInUserId || '' : selectedChannel?.custom.jobId}
        color={isEmployee ? selectedChannel?.custom.employeeColor : selectedChannel?.custom.jobColor}
        name={selectedChannel?.name}
        img={isEmployee ? selectedChannel?.custom.jobImg : selectedChannel?.custom.profileUrl}
        closeSendMessages={closeSendMessages}
      />
    );
  }, [closeSendMessages, isEmployee, loggedInUserId, selectedChannel]);

  const handleTabChange = useCallback(
    (event: any, value: number) => {
      setCurrentTabIndex(value);
      closeSendMessages();
    },
    [closeSendMessages],
  );

  return (
    <Box sx={styles.container}>
      <Tabs value={currentTabIndex} onChange={handleTabChange} centered>
        <Tab
          label={
            <WithBadge hasNotification={hasMatchNotification}>
              <AppHeaderText style={styles.tabText}>Matches</AppHeaderText>
            </WithBadge>
          }
        />
        <Tab
          label={
            <WithBadge hasNotification={!!hasReceivedLikeNotification}>
              <AppHeaderText style={styles.tabText}>{isEmployee ? 'Jobs' : 'Candidates'} that liked you</AppHeaderText>
            </WithBadge>
          }
        />
      </Tabs>
      <CustomTabPanel value={currentTabIndex} index={0}>
        <Grid container spacing={1} style={styles.matchesContainer}>
          <Grid style={styles.matchesSection} item md={selectedChannel ? 9.7 : 12}>
            <div style={styles.scrollViewContainer}>
              <div style={styles.scrollView}>{returnSortByCandidateView()}</div>
            </div>
          </Grid>
          {selectedChannel && (
            <Grid style={styles.messagesSection} item md={2.3}>
              {returnSendMessages()}
            </Grid>
          )}
        </Grid>
      </CustomTabPanel>
      <CustomTabPanel value={currentTabIndex} index={1}>
        <Grid container spacing={1} style={styles.matchesContainer}>
          <Grid style={styles.matchesSection} item md={selectedChannel ? 9.7 : 12}>
            <div style={styles.scrollViewContainer}>
              <div style={styles.scrollView}>{returnUsersThatLikedYou()}</div>
            </div>
          </Grid>
          {selectedChannel && (
            <Grid style={styles.messagesSection} item md={2.3}>
              {returnSendMessages()}
            </Grid>
          )}
        </Grid>
      </CustomTabPanel>
    </Box>
  );
};

export default Matches;
