import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addLoggedInUser } from 'reduxStore';
import { AppHeaderText, AppText, JobsBubble, UsersThatLikedYouList, WithBadge } from 'components';
import { TEmployee, TJob, TMatch } from 'types';
import { ChannelList } from 'screens';
import { getMatchesContainerHeight, getMatchesFromEmployersJobs } from 'utils';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useTheme } from 'theme/theme.context';
import { useDidMountEffect } from 'hooks';
import { UsersService } from 'services';

import { useStyles } from './MatchesStyles';

const Matches = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const employeeMatches = useSelector((state: RootState) => state.loggedInUser.matches);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const employeeReceivedLikes = useSelector((state: RootState) => state.loggedInUser.receivedLikes);
  const hasReceivedLikeNotification = useSelector((state: RootState) => state.loggedInUser.hasReceivedLikeNotification);
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const isEmployee = accountType === 'employee';

  const [isLoading, setIsLoading] = useState(false);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [hasMatchNotification, setHasMatchNotification] = useState(false);
  const [matches, setMatches] = useState<TMatch[]>([]);
  const [isCandidateSort, setIsCandidateSort] = useState(true);
  const [usersThatLikedYou, setUsersThatLikedYou] = useState<TEmployee[] & TJob[]>([]);
  const [routes] = React.useState([
    { key: 'first', title: 'Matches' },
    { key: 'second', title: 'Received Likes' },
  ]);

  const layout = useWindowDimensions();
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const styles = useStyles(isCandidateSort, matches.length);

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

  const MatchesTab = () => {
    return (
      <View style={styles.scrollViewContainer}>
        <ScrollView
          automaticallyAdjustContentInsets={false}
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentInset={styles.contentInset}>
          {/* {!isEmployee && (
    <View style={styles.sortContainer}>
      <AppBoldText style={styles.sortText}>Sort:</AppBoldText>
      <TouchableOpacity onPress={onJobSortPress} hitSlop={styles.hitSlop}>
        <AppBoldText style={styles.jobText}>JOB</AppBoldText>
      </TouchableOpacity>
      <AppText style={styles.slashCharacter}>{`  /  `}</AppText>
      <TouchableOpacity onPress={onCandidateSortPres} hitSlop={styles.hitSlop}>
        <AppBoldText style={styles.candidateText}>CANDIDATE</AppBoldText>
      </TouchableOpacity>
    </View>
  )} */}
          <View style={styles.matchesContainer}>
            {isCandidateSort ? returnSortByCandidateView() : returnSortByJobView()}
          </View>
        </ScrollView>
      </View>
    );
  };

  const ReceivedLikesTab = useCallback(() => {
    const noLikesText = isEmployee
      ? 'No jobs have liked your profile yet. Keep swiping!'
      : 'No candidates have liked any of your jobs yet. Keep swiping!';

    if (isLoading) {
      return <ActivityIndicator color={theme.color.spinnerColor} style={styles.spinner} size='large' />;
    } else {
      return (
        <View style={styles.candidatesChannelListWrapper}>
          {usersThatLikedYou.length < 1 && (
            <View style={styles.noMatchesTextContainer}>
              <AppText style={styles.text}>{noLikesText}</AppText>
            </View>
          )}

          <UsersThatLikedYouList
            usersThatLikedYou={usersThatLikedYou}
            setCurrentTabIndex={setCurrentTabIndex}
            getJobThatReceivedThisLike={getJobThatReceivedThisLike}
          />
        </View>
      );
    }
  }, [
    getJobThatReceivedThisLike,
    isEmployee,
    isLoading,
    styles.candidatesChannelListWrapper,
    styles.noMatchesTextContainer,
    styles.spinner,
    styles.text,
    theme.color.spinnerColor,
    usersThatLikedYou,
  ]);

  const renderScene = SceneMap({
    first: MatchesTab,
    second: ReceivedLikesTab,
  });

  const returnSortByJobView = useCallback(() => {
    if (employersJobs && employersJobs.length > 0) {
      const employersJobsTemp = [...employersJobs];
      return employersJobsTemp.reverse().map((job: TJob, index: number) => {
        const matches: TMatch[] = [];

        const tempMatches = [...job.matches];
        tempMatches.map((match: TMatch) => {
          const tempMatch = { ...match };
          tempMatch.custom = {
            ...tempMatch.custom,
            jobId: job._id,
            jobColor: job?.color,
            jobTitle: job?.settings?.title,
            jobImg: job?.settings?.img,
            companyName: job?.settings?.companyName,
          };
          matches.push(tempMatch);
        });
        return (
          <JobsBubble
            key={index}
            jobId={job?._id}
            jobColor={job?.color}
            jobTitle={job?.settings?.title || ''}
            jobImg={job?.settings?.img || ''}
            companyName={job?.settings?.companyName || ''}
            jobsMatches={matches}
          />
        );
      });
    } else {
      return (
        <View>
          <View style={styles.noMatchesTextContainer}>
            <AppText style={styles.text}>No matches yet. Continue connecting to start a conversation.</AppText>
          </View>
          <View style={styles.emptyJobPlaceholder}></View>
          <View style={styles.emptyJobPlaceholder}></View>
          <View style={styles.emptyJobPlaceholder}></View>
        </View>
      );
    }
  }, [employersJobs, styles.emptyJobPlaceholder, styles.noMatchesTextContainer, styles.text]);

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
      <View style={(styles.candidatesChannelListWrapper, { height: getMatchesContainerHeight(matches.length) })}>
        {matches.length < 1 && (
          <View style={styles.noMatchesTextContainer}>
            <AppText style={styles.text}>No matches yet. Continue connecting to start a conversation.</AppText>
          </View>
        )}

        <ChannelList matches={matches} isCandidateSort={true} />
      </View>
    );
  }, [
    employeeMatches,
    employersJobs,
    isEmployee,
    styles.candidatesChannelListWrapper,
    styles.noMatchesTextContainer,
    styles.text,
  ]);

  const onCandidateSortPres = () => {
    setIsCandidateSort(true);
  };

  const onJobSortPress = () => {
    setIsCandidateSort(false);
  };

  return (
    <View style={styles.matchesSection}>
      <TabView
        navigationState={{ index: currentTabIndex, routes }}
        renderScene={renderScene}
        onIndexChange={setCurrentTabIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.tabIndicator}
            renderLabel={({ route, focused }) => (
              <WithBadge
                hasNotification={route.title === 'Matches' ? hasMatchNotification : !!hasReceivedLikeNotification}>
                <AppHeaderText style={{ ...styles.tabText, color: focused ? theme.color.pink : theme.color.white }}>
                  {route.title}
                </AppHeaderText>
              </WithBadge>
            )}
          />
        )}
      />
    </View>
  );
};

export default Matches;
