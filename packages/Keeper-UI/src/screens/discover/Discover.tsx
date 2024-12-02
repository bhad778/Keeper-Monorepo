import React, { useEffect, useCallback, useState, memo } from 'react';
import { Animated, View, Easing, Dimensions, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { TEmployee, TJob, TMatch } from 'types';
import { JobPosting, Resume } from 'screens';
import { JobsService, MiscService, UsersService } from 'services';
import {
  AppText,
  EmployerDiscoverHeader,
  KeeperSpinnerOverlay,
  RedesignHeader,
  EducationModal,
  BottomSheet,
} from 'components';
import { RootState, addMatches, setBottomNavBarHeight, setSwipingDataRedux } from 'reduxStore';
import { filterArrayOfObjectsByKey, prefetchImages, useNotifications } from 'utils';
import { getItemsForSwipingLimit } from 'constants';
import { useNavigation } from '@react-navigation/native';
import { AlertModal } from 'modals';
import { useEmployer } from 'hooks';
import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';

import DislikeWhiteImage from '../../assets/svgs/icon_dislike-white.svg';
import LikedWhiteImage from '../../assets/svgs/icon_like-white.svg';
import { useStyles } from './DiscoverStyles';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Discover = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserExpoPushToken = useSelector((state: RootState) => state.loggedInUser.expoPushToken);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);
  const selectedJobTitle = useSelector((state: RootState) => state.local.selectedJob.settings.title);
  const selectedJobCompanyName = useSelector((state: RootState) => state.local.selectedJob.settings.companyName);
  const selectedJobImg = useSelector((state: RootState) => state.local.selectedJob.settings.img);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const swipingData = useSelector((state: RootState) => state.discover.swipingData);
  const employeeReceivedLikes = useSelector((state: RootState) => state.loggedInUser.receivedLikes);
  const jobReceivedLikes = useSelector((state: RootState) => state.local.selectedJob.receivedLikes);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);
  const jobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const loggedInUserEmail = useSelector((state: RootState) => state.loggedInUser.email);
  const employeeFirstName = useSelector((state: RootState) => state.loggedInUser.settings.firstName);
  const employeeLastName = useSelector((state: RootState) => state.loggedInUser.settings.lastName);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isGetDataForSwipingLoading = useSelector((state: RootState) => state.local.isGetDataForSwipingLoading);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

  const [slideUpValue] = useState<Animated.Value>(new Animated.Value(0));
  const [wholeSwiperFadeAnim] = useState<Animated.Value>(new Animated.Value(1));
  const [xIconFadeAnim] = useState<Animated.Value>(new Animated.Value(0));
  const [xIconScale] = useState<Animated.Value>(new Animated.Value(0));
  const [xIconTranslateYValue] = useState<Animated.Value>(new Animated.Value(0));
  const [wholeSwiperTranslateY] = useState<Animated.Value>(new Animated.Value(0));
  const [top] = useState(new Animated.Value(SCREEN_HEIGHT));
  const [isGetMoreSwipingItemsLoading, setIsGetMoreSwipingItemsLoading] = useState<boolean>(false);
  const [localSwipingData, setLocalSwipingData] = useState<(TEmployee[] & TJob[]) | []>([]);
  const [isAnimationHappening, setIsAnimationHappening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // this means that the last time they went to get swiping data, it did not
  // get the full amount, meaning that they have no more left after this time
  const [hasGottenLastFullSwipingData, setHasGottenLastFullSwipingData] = useState(false);
  const [likedCard, setLikedCard] = useState(false);
  const [isBrowsingLikeAlertOpen, setIsBrowsingLikeAlertOpen] = useState(false);
  const [educationModalVisible, setEducationModalVisible] = useState(!isLoggedIn);

  const navigation = useNavigation();

  const isEmployee = accountType === 'employee';
  const isNew = isEmployee ? isEmployeeNew : employersJobs && employersJobs.length === 0;
  const likeDislikeIconWidth = 120;

  const styles = useStyles(
    wholeSwiperFadeAnim,
    wholeSwiperTranslateY,
    xIconFadeAnim,
    xIconScale,
    xIconTranslateYValue,
    top,
    isEmployee,
    likeDislikeIconWidth,
    !!isNew,
  );
  const dispatch = useDispatch();
  const { setSelectedJob } = useEmployer();
  const { registerForPushNotificationsAsync } = useNotifications();

  useEffect(() => {
    if (!isEmployee && employersJobs && employersJobs.length > 0 && !selectedJobId) {
      setSelectedJob();
    } else if (swipingData?.length === 0 && !hasGottenLastFullSwipingData && !selectedJobId) {
      if (isNew) {
        // if theyre isNew then they havent completed profile yet so go get swiping data,
        getBrowsingData();
      }
      // else {
      //   // if theyre not isNew, then go get data specifically based on their profile information
      //   loadInitialData();
      // }
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setEducationModalVisible(true);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    runSlideUpAnimation();
    registerForPushNotificationsAsync(loggedInUserId, accountType, loggedInUserExpoPushToken);
  }, [loggedInUserId, accountType, loggedInUserExpoPushToken]);

  useEffect(() => {
    setLocalSwipingData(swipingData);

    setHasGottenLastFullSwipingData(swipingData?.length < getItemsForSwipingLimit);
  }, [swipingData]);

  useEffect(() => {
    // this is to preload the next image into the browser, we dont have to do anything
    // with this img variable. Loading the image just caches in into the browser
    const imageUrls = [localSwipingData[1]?.settings?.img || ''];

    prefetchImages(imageUrls);
  }, [localSwipingData]);

  const getBrowsingData = useCallback(async () => {
    if (accountType === 'employee') {
      setIsLoading(true);
      const jobsForSwiping = await JobsService.getJobsForSwiping({});
      dispatch(setSwipingDataRedux(jobsForSwiping));
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const employeesForSwiping = await UsersService.getEmployeesForSwiping({});
      dispatch(setSwipingDataRedux(employeesForSwiping));
      setIsLoading(false);
    }
  }, [accountType, dispatch]);

  const runSlideUpAnimation = useCallback(() => {
    Animated.timing(slideUpValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [slideUpValue]);

  const checkIfMatch = useCallback(
    async (potentialMatch: TEmployee & TJob, isMatch: boolean) => {
      // this if block is hit if they are a match
      if (isMatch) {
        Toast.show({
          type: 'success',
          text1: 'You Matched!',
          position: 'bottom',
          visibilityTime: 500,
        });

        let loggedInUserMatch: TMatch = {};

        let otherUserMatch: TMatch = {};

        if (isEmployee) {
          loggedInUserMatch = {
            name: potentialMatch.settings.title || '',
            custom: {
              profileUrl: potentialMatch.settings.img || '',
              hasNotification: true,
              expoPushToken: potentialMatch.expoPushToken || '',
              isNew: true,
              jobId: potentialMatch._id || '',
              jobOwnerId: potentialMatch.ownerId,
              jobOwnerEmail: potentialMatch.ownerEmail || '',
              jobColor: potentialMatch.color,
              jobTitle: potentialMatch.settings.title || '',
              jobImg: potentialMatch.settings.img || '',
              companyName: potentialMatch.settings.companyName || '',
              employeeColor: '',
              employeeId: loggedInUserId || '',
              employeeEmail: loggedInUserEmail || '',
            },
            description: 'Send the first message!',
            eTag: '',
            id: loggedInUserId + '-' + potentialMatch._id,
            updated: new Date().toString(),
          };

          otherUserMatch = {
            name: employeeSettings.firstName + ' ' + employeeSettings.lastName,
            custom: {
              profileUrl: employeeSettings.img || '',
              hasNotification: true,
              expoPushToken: loggedInUserExpoPushToken || '',
              isNew: true,
              jobId: potentialMatch._id || '',
              jobOwnerId: potentialMatch.ownerId,
              jobOwnerEmail: potentialMatch.ownerEmail || '',
              jobColor: potentialMatch.color,
              jobTitle: potentialMatch.settings.title || '',
              jobImg: potentialMatch.settings.img || '',
              companyName: potentialMatch.settings.companyName || '',
              employeeColor: '',
              employeeId: loggedInUserId || '',
              employeeEmail: loggedInUserEmail || '',
            },
            description: 'Send the first message!',
            eTag: '',
            id: loggedInUserId + '-' + potentialMatch._id,
            updated: new Date().toString(),
          };
        } else {
          loggedInUserMatch = {
            name: potentialMatch.settings.firstName + ' ' + potentialMatch.settings.lastName,
            custom: {
              profileUrl: potentialMatch.settings.img || '',
              hasNotification: true,
              expoPushToken: potentialMatch.expoPushToken || '',
              isNew: true,
              jobId: selectedJobId || '',
              jobOwnerId: loggedInUserId || '',
              jobOwnerEmail: loggedInUserEmail || '',
              jobColor: selectedJobId,
              jobTitle: selectedJobTitle || '',
              jobImg: selectedJobImg || '',
              companyName: selectedJobCompanyName || '',
              employeeColor: '',
              employeeId: potentialMatch._id || '',
              employeeEmail: potentialMatch.email || '',
            },
            description: 'Send the first message!',
            eTag: '',
            id: selectedJobId + '-' + potentialMatch._id,
            updated: new Date().toString(),
          };

          otherUserMatch = {
            name: selectedJobTitle || '',
            custom: {
              profileUrl: selectedJobImg || '',
              hasNotification: true,
              expoPushToken: loggedInUserExpoPushToken || '',
              isNew: true,
              jobId: selectedJobId || '',
              jobOwnerId: loggedInUserId || '',
              jobOwnerEmail: loggedInUserEmail || '',
              jobColor: selectedJobId,
              jobTitle: selectedJobTitle || '',
              jobImg: selectedJobImg || '',
              companyName: selectedJobCompanyName || '',
              employeeColor: '',
              employeeId: potentialMatch._id || '',
              employeeEmail: potentialMatch.email || '',
            },
            description: 'Send the first message!',
            eTag: '',
            id: selectedJobId + '-' + potentialMatch._id,
            updated: new Date().toString(),
          };
        }

        try {
          UsersService.addMatch({ accountType, loggedInUserMatch, otherUserMatch }).then((response: any) => {
            const messageObject = {
              to: potentialMatch.expoPushToken || '',
              title: 'You got a match!',
              body: `Send ${
                isEmployee ? `${employeeFirstName} ${employeeLastName}` : selectedJobCompanyName
              } a message!`,
              sound: 'default',
              data: {
                type: 'match',
                senderId: (isEmployee ? loggedInUserId : selectedJobId) || '',
                receiverId:
                  (isEmployee
                    ? response.otherUserMatch.custom.jobOwnerId
                    : response.otherUserMatch.custom.employeeId) || '',
                matchData: response.otherUserMatch,
              },
            } as const;

            MiscService.sendPubnubNotification({
              messageObject,
            });
            dispatch(addMatches({ newMatches: [response.loggedInUserMatch], jobId: selectedJobId }));
          });
        } catch (error) {
          console.error(`There was an error adding the match ${loggedInUserMatch}`);
        }
      } else if (localSwipingData[0]?.expoPushToken) {
        // if they are not a match then send received like notification
        if (localSwipingData[0].expoPushToken) {
          const messageObject = {
            to: localSwipingData[0].expoPushToken,
            title: 'You got a like!',
            body: '',
            sound: 'default',
            data: {
              type: 'receivedLike',
              likeData: localSwipingData[0]._id,
              senderId: (isEmployee ? loggedInUserId : selectedJobId) || '',
              receiverId: (isEmployee ? potentialMatch.ownerId : potentialMatch._id) || '',
            },
          } as const;
          MiscService.sendPubnubNotification({
            messageObject,
          });
        }
      }
    },
    [
      accountType,
      dispatch,
      employeeFirstName,
      employeeLastName,
      employeeSettings.firstName,
      employeeSettings.img,
      employeeSettings.lastName,
      isEmployee,
      localSwipingData,
      loggedInUserEmail,
      loggedInUserExpoPushToken,
      loggedInUserId,
      selectedJobId,
      selectedJobCompanyName,
      selectedJobImg,
      selectedJobTitle,
    ],
  );

  const closeModal = useCallback(() => {
    setIsEditModalOpen(false);
  }, []);

  const removeSwipedItemFromState = useCallback(() => {
    const localSwipingDataWithLatestRemoved = localSwipingData.slice(1, localSwipingData.length);

    if (
      !hasGottenLastFullSwipingData &&
      localSwipingDataWithLatestRemoved.length < 7 &&
      !isGetMoreSwipingItemsLoading
    ) {
      setIsGetMoreSwipingItemsLoading(true);
      try {
        if (isEmployee) {
          JobsService.getJobsForSwiping({
            userId: loggedInUserId,
            preferences: employeePreferences,
          }).then(jobsForSwipingData => {
            // if jobsForSwipingData.length < getItemsForSwipingLimit then they have gotten their last full feed before being out,
            // indicating that if we did this call again, it would return nothing because theres no more left
            setHasGottenLastFullSwipingData(jobsForSwipingData.length < getItemsForSwipingLimit);
            // make sure local swiping data and jobs for swipign have no overlap, because they should
            const uniqueArray = filterArrayOfObjectsByKey([...localSwipingData, ...jobsForSwipingData], '_id');
            // we remove one because, by the time we have done the api call to get more, the user is already looking at the one,
            // and that one will remain in state and even if we change state it will only put things behind it, so if we dont remove
            // it then it will be duplicated because it was already there in local frontend state, then its put there again from backend
            setLocalSwipingData(uniqueArray.slice(1, uniqueArray.length));
            setIsGetMoreSwipingItemsLoading(false);
          });
        } else {
          UsersService.getEmployeesForSwiping({
            preferences: jobPreferences,
            jobId: selectedJobId,
          }).then(employeesForSwipingData => {
            setHasGottenLastFullSwipingData(employeesForSwipingData.length < getItemsForSwipingLimit);
            const uniqueArray = filterArrayOfObjectsByKey([...localSwipingData, ...employeesForSwipingData], '_id');
            setLocalSwipingData(uniqueArray.slice(1, uniqueArray.length));
            setIsGetMoreSwipingItemsLoading(false);
          });
        }
      } catch (err) {
        console.error(err);
        setIsGetMoreSwipingItemsLoading(false);
      }
    } else {
      setLocalSwipingData(localSwipingDataWithLatestRemoved);
    }
  }, [
    employeePreferences,
    hasGottenLastFullSwipingData,
    isEmployee,
    isGetMoreSwipingItemsLoading,
    jobPreferences,
    localSwipingData,
    loggedInUserId,
    selectedJobId,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const runSwipeAnimation = useCallback(() => {
    setIsAnimationHappening(true);
    Animated.parallel([
      // swiper fades out
      Animated.timing(wholeSwiperFadeAnim, {
        toValue: 0,
        duration: 1,
        useNativeDriver: true,
      }).start(() => {
        Animated.parallel([
          // instantly after fade send swiper down below screen so it can slide back up later
          Animated.timing(wholeSwiperTranslateY, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          }),
          removeSwipedItemFromState(),
          // after resume has faded, slide down out of view, and the state has been set,
          // then fade back in for slide back up into view later
          Animated.timing(wholeSwiperFadeAnim, {
            toValue: 1,
            duration: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }),

      // X icon fade in
      Animated.timing(xIconFadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),

      // X icon grow
      Animated.timing(xIconScale, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        // cubic-bezier(.34,.21,0,.99)
        easing: Easing.bezier(0.34, 0.21, 0, 0.99),
      }),

      // X icon slide up
      Animated.timing(xIconTranslateYValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        Animated.parallel([
          // slide swiper back up
          Animated.timing(wholeSwiperTranslateY, {
            toValue: 0,
            delay: 200,
            duration: 500,
            useNativeDriver: true,
            // cubic-bezier(.25,1.07,.91,.99)
            easing: Easing.bezier(0.25, 1.07, 0.91, 0.99),
          }),

          //X icon shrink
          Animated.timing(xIconScale, {
            toValue: 0,
            delay: 30,
            duration: 400,
            useNativeDriver: true,
          }).start(() => {
            // revert y value for next swipe
            Animated.timing(xIconTranslateYValue, {
              toValue: 0.5,
              duration: 1,
              useNativeDriver: true,
            }).start();
            // revert X icon size for next swipe
            Animated.timing(xIconScale, {
              toValue: 0,
              duration: 1,
              useNativeDriver: true,
            }).start(() => {});
          }),
        ]).start(() => {});
      }),
    ]).start(() => {
      dispatch(setBottomNavBarHeight(bottomTabNavigatorBaseHeight));
      setIsAnimationHappening(false);
    });
  }, [
    dispatch,
    removeSwipedItemFromState,
    wholeSwiperFadeAnim,
    wholeSwiperTranslateY,
    xIconFadeAnim,
    xIconScale,
    xIconTranslateYValue,
  ]);

  const swipe = useCallback(
    async (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => {
      const alreadySwipedOnArray = isEmployee ? employeeReceivedLikes : jobReceivedLikes;
      const isMatch =
        alreadySwipedOnArray &&
        alreadySwipedOnArray.length > 0 &&
        alreadySwipedOnArray.some((item: string) => item === localSwipingData[0]._id);
      // if your not logged in, then keep track of notLoggedInSwipeCount and handle accordingly
      // if (!isLoggedIn) {
      //   setNotLoggedInSwipeCount(prevState => prevState + 1);
      //   if (notLoggedInSwipeCount >= 5) {
      //     // if its greater than or equal to 5 and your an employee, then you cant swipe anymore
      //     setIsEditModalOpen(true);
      //     return;
      //   }
      // }

      // this is if you press like while browsing
      if (isNew) {
        setIsBrowsingLikeAlertOpen(true);
        return;
      }

      dispatch(setBottomNavBarHeight(-1));

      const newSwipe = {
        ownerId: isEmployee ? loggedInUserId : selectedJobId,
        isRightSwipe,
        receiverId: currentItemId,
        createdOnWeb: false,
        timeStamp: new Date(),
        accountType,
        isMatch,
      };

      if (!isNextSwipe) {
        UsersService.recordSwipe(newSwipe);
      }

      // remove the job thats been swiped on from the array,
      // while also recording the swipe in the updateSwipeData function
      // updateSwipeData(isRightSwipe);

      if (isRightSwipe) {
        checkIfMatch(localSwipingData[0]);
      }

      runSwipeAnimation();
    },
    [
      isEmployee,
      employeeReceivedLikes,
      jobReceivedLikes,
      isNew,
      dispatch,
      loggedInUserId,
      selectedJobId,
      accountType,
      runSwipeAnimation,
      localSwipingData,
      checkIfMatch,
    ],
  );

  // const routeToViewResume = useCallback(() => {
  //   navigation.navigate('ViewResume');
  // }, [navigation]);

  const showLikedOrDislikedPhoto = useCallback(
    (liked: boolean) => {
      const imageStyle = [styles.likeDislikeIcon, styles.xIconAnimatedImage];
      let imageComponent = null;

      if (liked) {
        imageComponent = <LikedWhiteImage width={likeDislikeIconWidth} height={100} />;
      } else {
        imageComponent = <DislikeWhiteImage width={likeDislikeIconWidth} height={100} />;
      }

      return <Animated.View style={imageStyle}>{imageComponent}</Animated.View>;
    },
    [styles.likeDislikeIcon, styles.xIconAnimatedImage],
  );

  const returnEmptyLocalSwipingDataUi = useCallback(() => {
    if (isLoading) {
      return <View></View>;
    } else {
      return (
        <>
          {isEmployee ? (
            <RedesignHeader title='Jobs' containerStyles={styles.emptyHeader} titleStyles={styles.headerTitle} />
          ) : (
            <EmployerDiscoverHeader />
          )}

          {!isLoading && !isGetDataForSwipingLoading && (
            <View style={styles.noMoreLeftContainer}>
              <AppText style={styles.noMoreLeftText}>
                {isLoggedIn
                  ? `You have ran out of ${isEmployee ? 'jobs' : 'candidates'} in your area.`
                  : `Create an account to see more!`}
              </AppText>
            </View>
          )}
        </>
      );
    }
  }, [
    isEmployee,
    isGetDataForSwipingLoading,
    isLoading,
    isLoggedIn,
    styles.emptyHeader,
    styles.headerTitle,
    styles.noMoreLeftContainer,
    styles.noMoreLeftText,
  ]);

  const returnSwipingCards = useCallback(() => {
    if (localSwipingData && localSwipingData[0]) {
      if (isEmployee) {
        return <JobPosting setLikedCard={setLikedCard} swipe={swipe} currentJob={localSwipingData[0]} />;
      } else {
        return (
          <Resume
            setLikedCard={setLikedCard}
            swipe={swipe}
            resumeScrollViewRef={(el: any) => (resumeScrollViewRef = el)}
            currentEmployee={localSwipingData[0]}
            isNew={!!isNew}
          />
        );
      }
    } else {
      return <View>{returnEmptyLocalSwipingDataUi()}</View>;
    }
  }, [isEmployee, isNew, localSwipingData, returnEmptyLocalSwipingDataUi, swipe]);

  const closeIsBrowsingLikeAlertModal = useCallback(() => {
    setIsBrowsingLikeAlertOpen(false);
  }, []);

  // const navigateToProfileTab = useCallback(() => {
  //   closeIsBrowsingLikeAlertModal();
  //   navigation.navigate('Root', { screen: 'Profile' });
  // }, [closeIsBrowsingLikeAlertModal, navigation]);

  const navigateToProfileTab = useCallback(() => {
    closeIsBrowsingLikeAlertModal();
    if (isEmployee) {
      navigation.navigate('Root', { screen: 'Profile' });
    } else {
      navigation.navigate('Root', { screen: 'Sign Up' });
    }
  }, [closeIsBrowsingLikeAlertModal, isEmployee, navigation]);

  const returnAlertModalConfirmText = useCallback(() => {
    if (isEmployee) {
      if (isLoggedIn) {
        return 'Finish Profile';
      } else {
        return 'Sign Up';
      }
    } else if (isLoggedIn) {
      return 'Create Job';
    } else {
      return 'Sign Up';
    }
  }, [isEmployee, isLoggedIn]);

  const returnAlertModalSubtitle = useCallback(() => {
    if (isEmployee) {
      if (isLoggedIn) {
        return `You can't like until you finishing creating a profile`;
      } else {
        return `You can't like until you sign up and create a profile`;
      }
    } else if (isLoggedIn) {
      return `You can't like until you create a job`;
    } else {
      return `You can't like until you sign up and create a job`;
    }
  }, [isEmployee, isLoggedIn]);

  const closeEducationModal = useCallback(() => {
    setEducationModalVisible(false);
  }, []);

  const onEducationModalButtonPress = useCallback(() => {
    closeEducationModal();
    navigateToProfileTab();
  }, [closeEducationModal, navigateToProfileTab]);

  return (
    <>
      {/* <KeeperModal
        isModalOpen={educationModalVisible}
        modalStyles={{
          flex: 1,
          backgroundColor: '#1e1e1e',
          alignItems: 'center',
          justifyContent: 'space-around',
          width: SCREEN_WIDTH,
          borderRadius: 0,
          left: -20,
        }}
        closeModal={closeEducationModal}>
        <View
          style={{
            backgroundColor: '#F4C0FF',
            width: '100%',
            height: 50,
            marginTop: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <AppBoldText style={{ fontSize: 20, color: 'black' }}>Tap Cards to Preview App </AppBoldText>
        </View>
        <AppBoldText style={{ textAlign: 'center', color: 'white', fontSize: 40 }}>Welcome to Keeper</AppBoldText>
        <KeeperTouchable onPress={closeEducationModal}>
          <Image
            style={{ position: 'relative', left: 20, height: 350, width: 350 }}
            source={require('assets/images/educationImage.png')}
          />
        </KeeperTouchable>

        <AppText style={{ textAlign: 'center' }}>
          Keeper functions like a dating app to connect tech recruiters to software candidates. Post a job opening to
          get a tailored feed of candidates and gain access to our dev database.
        </AppText>
        <KeeperSelectButton onPress={onEducationModalButtonPress} title='Post Your First Job' />
      </KeeperModal> */}

      <EducationModal />

      <AlertModal
        isOpen={isBrowsingLikeAlertOpen}
        title={`You're in preview mode`}
        subTitle={returnAlertModalSubtitle()}
        closeModal={closeIsBrowsingLikeAlertModal}
        onConfirmPress={navigateToProfileTab}
        confirmText={returnAlertModalConfirmText()}
        denyText='Keep Browsing'
      />
      <KeeperSpinnerOverlay isLoading={isLoading || isGetDataForSwipingLoading} color={'white'} />

      <View style={styles.container}>
        {isNew ? (
          <Animated.View style={[styles.xIcon, styles.xIconAnimatedImage]}>
            <Image source={require('../../assets/images/keeperLogo.png')} style={{ height: 120, width: 120 }} />
          </Animated.View>
        ) : (
          showLikedOrDislikedPhoto(likedCard)
        )}

        <View>
          <Animated.View style={styles.swipingCardsAnimatedView}>
            {!isAnimationHappening && returnSwipingCards()}
          </Animated.View>
        </View>
      </View>
    </>
  );
};

export default memo(Discover);
