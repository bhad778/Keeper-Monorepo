import { useEffect, useCallback, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { TEmployee, TJob, TMatch, TSwipe } from 'keeperTypes';
import { JobsService, MiscService, UsersService, useAuth } from 'services';
import {
  AlertModal,
  AppHeaderText,
  EmployerDiscoverHeader,
  JobPostingComponent,
  KeeperImage,
  ResumeComponent,
} from 'components';
import { RootState, addLoggedInUser, addMatches, setSwipingDataRedux } from 'reduxStore';
import { filterArrayOfObjectsByKey } from 'utils';
import { getItemsForSwipingLimit } from 'constants/globalConstants';
import { gsap } from 'gsap';
import DislikeWhiteImage from 'assets/svgs/icon_dislike-white.svg?react';
import LikedWhiteImage from 'assets/svgs/icon_like-white.svg?react';
import LoadingScreen from 'screens/loadingScreen/LoadingScreen';
import { useNavigate, useParams } from 'react-router-dom';
import { useEmployer } from 'hooks';
import { TPubnubNotificationMessageObject } from 'types/globalTypes';

import KeeperLogo from '../../assets/images/keeperLogo.png';
import { useStyles } from './DiscoverStyles';

type DiscoverProps = {
  onBackClick: () => void;
};

// this component handles the actual swiping- the matching, the carousel, etc
const Discover = ({ onBackClick }: DiscoverProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const loggedInUserExpoPushToken = useSelector((state: RootState) => state.loggedInUser.expoPushToken);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);
  const selectedJobTitle = useSelector((state: RootState) => state.local.selectedJob.settings.title);
  const selectedJobCompanyName = useSelector((state: RootState) => state.local.selectedJob.settings.companyName);
  const selectedJobImg = useSelector((state: RootState) => state.local.selectedJob.settings.img);
  const selectedJobColor = useSelector((state: RootState) => state.local.selectedJob.color);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const swipingData = useSelector((state: RootState) => state.discover.swipingData);
  const employeeReceivedLikes = useSelector((state: RootState) => state.loggedInUser.receivedLikes);
  const jobReceivedLikes = useSelector((state: RootState) => state.local.selectedJob.receivedLikes);
  const employeePreferences = useSelector((state: RootState) => state.loggedInUser.preferences);
  const jobPreferences = useSelector((state: RootState) => state.local.selectedJob.preferences);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const employeeFirstName = useSelector((state: RootState) => state.loggedInUser.settings.firstName);
  const employeeLastName = useSelector((state: RootState) => state.loggedInUser.settings.lastName);
  const loggedInUserEmail = useSelector((state: RootState) => state.loggedInUser.email);
  const isGetDataForSwipingLoading = useSelector((state: RootState) => state.local.isGetDataForSwipingLoading);
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

  const [isGetMoreSwipingItemsLoading, setIsGetMoreSwipingItemsLoading] = useState<boolean>(false);
  const [localSwipingData, setLocalSwipingData] = useState<(TEmployee[] & TJob[]) | []>([]);
  const [isAnimationHappening, setIsAnimationHappening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBrowsingLikeAlertOpen, setIsBrowsingLikeAlertOpen] = useState(false);
  // this means that the last time they went to get swiping data, it did not
  // get the full amount, meaning that they have no more left after this time
  const [hasGottenLastFullSwipingData, setHasGottenLastFullSwipingData] = useState(false);
  const [likedCard, setLikedCard] = useState(false);

  const animatedContainerRef = useRef(null);
  const keeperLogoRef = useRef(null);
  const thumbsUpOrDownRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const isEmployee = accountType === 'employee';
  const isNew = isEmployee ? isEmployeeNew : employersJobs && employersJobs.length === 0;

  type DiscoverParamTypes = {
    accountTypeParam: 'dev' | 'recruiter';
    yearsOfExperienceParam: string;
    mainSkillParam: string;
    jobOrResumeIdParam: string;
  };

  const { accountTypeParam, yearsOfExperienceParam, mainSkillParam, jobOrResumeIdParam } =
    useParams<DiscoverParamTypes>();
  const dispatch = useDispatch();
  const { loadInitialData } = useAuth();
  const { setSelectedJob } = useEmployer();
  const styles = useStyles(isEmployee, selectedJobColor);

  useEffect(() => {
    if (yearsOfExperienceParam || mainSkillParam || jobOrResumeIdParam) {
      getNotLoggedInSwipingData();
    } else if (!isEmployee && employersJobs && employersJobs.length > 0 && !selectedJobId) {
      setSelectedJob();
    } else {
      // only go get data if theres none cached in redux
      if (swipingData?.length === 0 && !hasGottenLastFullSwipingData && !selectedJobId) {
        if (isNew) {
          // if theyre isNew then they havent completed profile yet so go get swiping data,
          // based on data from a link, and if they didnt get there from link then go get blank data
          getNotLoggedInSwipingData();
        } else {
          // if theyre not isNew, then go get data specifically based on their profile information
          loadInitialData();
        }
      }
    }
  }, []);

  useEffect(() => {
    setLocalSwipingData(swipingData || []);
  }, [swipingData]);

  useEffect(() => {
    // this is to preload the next image into the browser, we dont have to do anything
    // with this img variable. Loading the image just caches in into the browser
    const img = new Image();
    img.src = localSwipingData[1]?.settings?.img || '';
  }, [localSwipingData]);

  const getNotLoggedInSwipingData = useCallback(async () => {
    let tempAccountType = accountTypeParam || accountType;

    if (tempAccountType === 'dev') {
      tempAccountType = 'employee';
    } else if (tempAccountType === 'recruiter') {
      tempAccountType = 'employer';
    }
    dispatch(addLoggedInUser({ accountType: tempAccountType }));

    let getUserFromParamsPromise: any;
    setIsLoading(true);

    if (tempAccountType === 'employee') {
      // if jobOrResumeIdParam then that means we want one specific job or resume to be at the top,
      // so go get that by id so we can put it on the top of the stack later
      if (jobOrResumeIdParam) {
        getUserFromParamsPromise = JobsService.getJobById({
          jobId: jobOrResumeIdParam || '',
        });
      }

      let employeePreferences;

      // if all of these params, then that means a user has taken a link and we want to populate
      // their feed with specific users/jobs based on the data in link.
      if (accountTypeParam && yearsOfExperienceParam && mainSkillParam) {
        employeePreferences = {
          searchRadius: 50,
          requiredYearsOfExperience: Number(yearsOfExperienceParam),
          geoLocation: {
            type: 'Point',
            coordinates: [0, 0],
          },
          relevantSkills: [mainSkillParam],
          isRemote: true,
          isNew: false,
        };
      }

      try {
        // if they did not get here from a link, then just go grab any users by passing just {}
        const jobsForSwipingPromise = JobsService.getJobsForSwiping(
          employeePreferences ? { preferences: employeePreferences } : {},
        );
        const response = await Promise.all([jobsForSwipingPromise, getUserFromParamsPromise]);

        const jobsForSwiping = response[0];
        const userFromParams: TJob = response[1];

        if (jobsForSwiping && jobsForSwiping.length > 0) {
          if (userFromParams) {
            dispatch(setSwipingDataRedux([userFromParams, ...jobsForSwiping]));
          } else {
            dispatch(setSwipingDataRedux(jobsForSwiping));
          }
        }
        dispatch(addLoggedInUser({ accountType: tempAccountType }));
      } catch (error) {
        console.error('There was an error getting swiping data new user: ' + error);
      }
    } else if (tempAccountType === 'employer') {
      if (jobOrResumeIdParam) {
        getUserFromParamsPromise = await UsersService.getEmployee({
          userId: jobOrResumeIdParam || '',
        });
      }

      let jobPreferences;

      if (accountTypeParam && yearsOfExperienceParam && mainSkillParam) {
        jobPreferences = {
          searchRadius: 50,
          yearsOfExperience: Number(yearsOfExperienceParam),
          geoLocation: {
            type: 'Point',
            coordinates: [0, 0],
          },
          relevantSkills: [mainSkillParam],
          isRemote: true,
        };
      }

      try {
        const employeesForSwipingPromise = UsersService.getEmployeesForSwiping(
          jobPreferences ? { preferences: jobPreferences } : {},
        );
        const response = await Promise.all([employeesForSwipingPromise, getUserFromParamsPromise]);

        const employeesForSwiping = response[0];
        const userFromParams: TEmployee = response[1];

        if (employeesForSwiping && employeesForSwiping.length > 0) {
          if (userFromParams) {
            dispatch(setSwipingDataRedux([userFromParams, ...employeesForSwiping]));
          } else {
            dispatch(setSwipingDataRedux(employeesForSwiping));
          }
        }

        dispatch(addLoggedInUser({ accountType: tempAccountType }));
      } catch (error) {
        console.error('There was an error getting swiping data new user: ' + error);
      }
    }
    setIsLoading(false);
  }, [accountType, accountTypeParam, dispatch, jobOrResumeIdParam, mainSkillParam, yearsOfExperienceParam]);

  const checkIfMatch = useCallback(
    async (potentialMatch: TEmployee & TJob, isMatch: boolean) => {
      // this if block is hit if they are a match
      if (isMatch) {
        toast.success('You Matched!');

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
              jobColor: selectedJobColor,
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
              jobColor: selectedJobColor,
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
          UsersService.addMatch({
            accountType,
            loggedInUserMatch,
            otherUserMatch,
          }).then((response: any) => {
            try {
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
            } catch (error) {
              console.error('there was an error sending expo push notification from message send- ', error);
            }

            dispatch(
              addMatches({
                newMatches: [response.loggedInUserMatch],
                jobId: selectedJobId,
              }),
            );
          });
        } catch (error) {
          console.error(`There was an error adding the match ${loggedInUserMatch}`);
        }
      }
      // else {
      //   // if they are not a match then send received like notification
      //   if (localSwipingData[0].expoPushToken) {
      //     const messageObject = {
      //       to: localSwipingData[0].expoPushToken,
      //       title: 'You got a like!',
      //       body: '',
      //       sound: 'default',
      //       data: {
      //         type: 'like',
      //         likeData: localSwipingData[0]._id,
      //         senderId: (isEmployee ? loggedInUserId : selectedJobId) || '',
      //         receiverId: (isEmployee ? potentialMatch.ownerId : potentialMatch._id) || '',
      //       },
      //     } as const;
      //     MiscService.sendPubnubNotification({
      //       messageObject,
      //     });
      //   }
      // }
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
      loggedInUserEmail,
      loggedInUserExpoPushToken,
      loggedInUserId,
      selectedJobColor,
      selectedJobCompanyName,
      selectedJobId,
      selectedJobImg,
      selectedJobTitle,
    ],
  );

  const removeSwipedItemFromState = useCallback(() => {
    const localSwipingDataWithLatestRemoved = localSwipingData.slice(1, localSwipingData.length);
    dispatch(setSwipingDataRedux(localSwipingDataWithLatestRemoved));

    // check to see if we should go get more data for swiping
    if (
      !hasGottenLastFullSwipingData &&
      localSwipingDataWithLatestRemoved.length < 7 &&
      !isGetMoreSwipingItemsLoading
    ) {
      setIsGetMoreSwipingItemsLoading(true);
      try {
        if (isEmployee) {
          JobsService.getJobsForSwiping(
            isNew
              ? {}
              : {
                  userId: loggedInUserId,
                  preferences: employeePreferences,
                },
          ).then(jobsForSwipingData => {
            // if jobsForSwipingData.length < getItemsForSwipingLimit then they have gotten their last full feed before being out,
            // indicating that if we did this call again, it would return nothing because theres no more left
            setHasGottenLastFullSwipingData(jobsForSwipingData.length < getItemsForSwipingLimit);
            // make sure local swiping data and jobs for swiping have no overlap, because they should
            const uniqueArray = filterArrayOfObjectsByKey([...localSwipingData, ...jobsForSwipingData], '_id');
            // we remove one because, by the time we have done the api call to get more, the user is already looking at the one,
            // and that one will remain in state and even if we change state it will only put things behind it, so if we dont remove
            // it then it will be duplicated because it was already there in local frontend state, then its put there again from backend
            setLocalSwipingData(uniqueArray.slice(1, uniqueArray.length));
            setIsGetMoreSwipingItemsLoading(false);
          });
        } else {
          UsersService.getEmployeesForSwiping(
            isNew
              ? {}
              : {
                  preferences: jobPreferences,
                  jobId: selectedJobId,
                },
          ).then(employeesForSwipingData => {
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
    dispatch,
    employeePreferences,
    hasGottenLastFullSwipingData,
    isEmployee,
    isGetMoreSwipingItemsLoading,
    isNew,
    jobPreferences,
    localSwipingData,
    loggedInUserId,
    selectedJobId,
  ]);

  const swipe = async (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => {
    const alreadySwipedOnArray = isEmployee ? employeeReceivedLikes : jobReceivedLikes;
    const isMatch =
      alreadySwipedOnArray &&
      alreadySwipedOnArray.length > 0 &&
      alreadySwipedOnArray.some((item: string) => item === localSwipingData[0]._id);

    // make one for employer but if they are employee then override it
    let likeNotificationObject = {
      to: localSwipingData[0].expoPushToken || 'none',
      title: 'A candidate liked your job!',
      body: `Go checkout the matches tab to see who liked you.`,
      sound: 'default',
      data: {
        type: 'like' as const,
        senderId: selectedJobId || '',
        receiverId: localSwipingData[0]._id || '',
      },
    };

    if (isEmployee) {
      likeNotificationObject = {
        to: localSwipingData[0].expoPushToken || 'none',
        title: 'A job liked your profile!',
        body: `Go checkout the matches tab to see who liked you.`,
        sound: 'default',
        data: {
          type: 'like' as const,
          senderId: loggedInUserId || '',
          receiverId: localSwipingData[0].ownerId || '',
          jobId: localSwipingData[0]._id || '',
        },
      };
    }

    const newSwipe: TSwipe & {
      accountType: string;
      isMatch: boolean;
      likeNotificationObject: TPubnubNotificationMessageObject;
      jobOwnerId?: string;
    } = {
      ownerId: isEmployee ? loggedInUserId : selectedJobId,
      jobOwnerId: isEmployee ? localSwipingData[0].ownerId : '',
      isRightSwipe,
      receiverId: currentItemId,
      createdOnWeb: true,
      timeStamp: new Date(),
      accountType,
      isMatch,
      likeNotificationObject,
    };

    try {
      const messageObject = {
        to: newMatchUser.expoPushToken || '',
        title: 'You got a match!',
        body: `Send ${
          isEmployee ? `${employeeFirstName} ${employeeLastName}` : jobThatGotMatch?.settings.companyName
        } a message!`,
        sound: 'default',
        data: {
          type: 'match',
          senderId: (isEmployee ? loggedInUserId : jobThatGotMatch?._id) || '',
          receiverId:
            (isEmployee ? response.otherUserMatch.custom.jobOwnerId : response.otherUserMatch.custom.employeeId) || '',
          matchData: response.otherUserMatch,
        },
      } as const;
      MiscService.sendPubnubNotification({
        messageObject,
      });
    } catch (error) {
      console.error('there was an error sending expo push notification from message send- ', error);
    }

    // this is if you press like while browsing
    if (isNew) {
      setIsBrowsingLikeAlertOpen(true);
      return;
    }

    if (!isNextSwipe) {
      UsersService.recordSwipe(newSwipe);
    }

    // remove the job thats been swiped on from the array,
    // while also recording the swipe in the updateSwipeData function
    // updateSwipeData(isRightSwipe);

    if (isRightSwipe) {
      checkIfMatch(localSwipingData[0], isMatch);
    }
    runSwipeAnimation();
  };

  const containerFadeTime = 0.5;
  const thumbAnimationTime = 0.5;

  const resetSwipeAnimation = () => {
    removeSwipedItemFromState();

    // fade whole resume/jobposting back in
    gsap.to(animatedContainerRef.current, {
      duration: containerFadeTime,
      autoAlpha: 1,
      onComplete: () => setIsAnimationHappening(false),
    });

    // fade and shrink thumbs icon out
    gsap.to(thumbsUpOrDownRef.current, {
      duration: thumbAnimationTime,
      autoAlpha: 0,
      scale: 0,
      ease: 'expo',
    });

    // fade and shrink thumbs icon out
    gsap.to(keeperLogoRef.current, {
      duration: thumbAnimationTime,
      autoAlpha: 0,
      scale: 0,
      ease: 'expo',
    });
  };

  const runSwipeAnimation = () => {
    setIsAnimationHappening(true);
    // fade whole resume/jobposting out
    // then run onCompleteFadeOut
    gsap.to(animatedContainerRef.current, {
      duration: containerFadeTime,
      autoAlpha: 0,
      onComplete: () => {
        scrollContainerRef?.current?.scrollTo(0, 0);
      },
    });

    // fade in and grow thumbs up or down icon
    gsap.to(thumbsUpOrDownRef.current, {
      duration: thumbAnimationTime,
      autoAlpha: 1,
      scale: 3,
      ease: 'expo',
      onComplete: resetSwipeAnimation,
    });

    // fade in and grow keeper logo icon
    gsap.to(keeperLogoRef.current, {
      duration: thumbAnimationTime,
      autoAlpha: 1,
      scale: 3,
      ease: 'expo',
    });
  };

  const showLikedOrDislikedPhoto = (liked: boolean) => {
    let imageComponent = null;

    if (liked) {
      imageComponent = <LikedWhiteImage width={120} height={100} />;
    } else {
      imageComponent = <DislikeWhiteImage width={120} height={100} />;
    }

    return (
      <div style={styles.likeDislikeIcon} ref={thumbsUpOrDownRef}>
        {imageComponent}
      </div>
    );
  };

  const returnEmptyLocalSwipingDataUi = () => {
    if (isLoading || isGetDataForSwipingLoading) {
      return <LoadingScreen />;
    } else {
      return (
        <div style={styles.noMoreLeftContainer}>
          {!isEmployee && <EmployerDiscoverHeader />}
          {/* {isLoggedIn && !isEmployee && <BackButton containerStyles={styles.backButton} onClick={onBackClick} />} */}
          {/* this is because it would flash 'Sign up to see more', everytime we landed on this page because
          the useeffect that sets localSwipingData hasnt finished yet */}
          {swipingData && swipingData[0] ? (
            <></>
          ) : (
            <AppHeaderText style={styles.noMoreLeftText}>
              {isLoggedIn
                ? `You have ran out of ${
                    isEmployee ? 'jobs' : 'candidates with the selected filters'
                  }. Check back tomorrow for more.`
                : `Sign up to see more!`}
            </AppHeaderText>
          )}
        </div>
      );
    }
  };

  const returnSwipingCards = () => {
    if (localSwipingData && localSwipingData[0]) {
      if (isEmployee) {
        return (
          <JobPostingComponent
            isOwner={false}
            currentJobSettings={localSwipingData[0].settings}
            swipe={swipe}
            setLikedCard={setLikedCard}
            currentJobId={localSwipingData[0]._id}
            isNew={isNew}
          />
        );
        // }
      } else {
        if (localSwipingData[0]) {
          return (
            <>
              <EmployerDiscoverHeader />
              <ResumeComponent
                onBackClick={onBackClick}
                isOwner={false}
                currentEmployeeSettings={localSwipingData[0].settings}
                jobColor={selectedJobColor}
                swipe={swipe}
                setLikedCard={setLikedCard}
                currentEmployeeId={localSwipingData[0]._id}
                isNew={isNew}
              />
            </>
          );
          // }
        }
      }
    } else {
      return returnEmptyLocalSwipingDataUi();
    }
  };

  const navigateToProfileTab = () => {
    if (isEmployee) {
      if (isLoggedIn) {
        navigate('/employeeHome/profile');
      } else {
        navigate('/browse/profile');
      }
    } else {
      if (isLoggedIn) {
        navigate('/employerHome/jobBoard');
      } else {
        navigate('/browse/profile');
      }
    }
  };

  const closeIsBrowsingLikeAlertModal = () => {
    setIsBrowsingLikeAlertOpen(false);
  };

  const returnAlertModalSubtitle = () => {
    if (isEmployee) {
      if (isLoggedIn) {
        return "You can't like until you finishing creating a profile";
      } else {
        return "You can't like until you sign up and create a profile";
      }
    } else {
      if (isLoggedIn) {
        return "You can't like until you create a job";
      } else {
        return "You can't like until you sign up and create a job";
      }
    }
  };

  const returnAlertModalConfirmText = () => {
    if (isEmployee) {
      if (isLoggedIn) {
        return 'Finish Profile';
      } else {
        return 'Sign Up';
      }
    } else {
      if (isLoggedIn) {
        return 'Create Job';
      } else {
        return 'Sign Up';
      }
    }
  };

  return (
    <div style={styles.container} ref={scrollContainerRef}>
      <AlertModal
        isOpen={isBrowsingLikeAlertOpen}
        title='Limited Access Mode'
        subTitle={returnAlertModalSubtitle()}
        closeModal={closeIsBrowsingLikeAlertModal}
        onConfirmPress={navigateToProfileTab}
        confirmText={returnAlertModalConfirmText()}
        denyText='Continue Browsing'
      />
      {/* {isNew && (
        <Clickable style={styles.browseModeTextContainer} onClick={navigateToProfileTab}>
          <AppHeaderText style={styles.limitedAccessTitle}>Limited Access Mode</AppHeaderText>
          <AppText style={styles.limitedAccessSubtitle}>{browseTopText}</AppText>
        </Clickable>
      )} */}

      {isNew ? (
        <div ref={keeperLogoRef} style={styles.keeperLogoAnimationIcon}>
          <KeeperImage source={KeeperLogo} style={{ height: 50, width: 50 }} />
        </div>
      ) : (
        showLikedOrDislikedPhoto(likedCard)
      )}
      {returnSwipingCards()}
    </div>
  );
};

export default Discover;
