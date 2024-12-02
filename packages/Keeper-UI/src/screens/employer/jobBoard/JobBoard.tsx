import React, { useState, useCallback, useEffect, memo } from 'react';
import { ActivityIndicator, View, Animated, Easing, ScrollView, TouchableOpacity } from 'react-native';
import { AppHeaderText, KeeperSelectButton, RedesignHeader, JobBoardListing } from 'components';
import { LinearGradient } from 'expo-linear-gradient';
import { RootState } from 'reduxStore/store';
import { TJob } from 'types/employerTypes';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useDidMountEffect } from 'hooks';
import { jobColors } from 'constants/globalConstants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { SettingsModal } from 'modals';

import AddJob from '../addJob/AddJob';
import { useStyles } from './JobBoardStyles';
import CogIcon from '../../../assets/svgs/settingsIconWhite.svg';

const JobBoard = () => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);

  const [addJobModalVisible, setAddJobModalVisible] = useState(false);
  const [jobColor, setJobColor] = useState('');
  const [newSubmittedJob, setNewSubmittedJob] = useState<TJob>();
  const [newJobLoadingAnimatedValue] = useState(new Animated.Value(0.01));
  const [newJobLoadingProgress, setNewJobLoadingProgress] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isKeeperProModalOpen, setIsKeeperProModalOpen] = useState(false);
  const [jobMenusOpen, setJobMenusOpen] = useState<string[]>([]);
  const [deletedJob, setDeletedJob] = useState<TJob>();

  const styles = useStyles(fadeAnim);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // useEffect(() => {
  //   if (employersJobs && employersJobs.length === 0 && isNew && isLoggedIn) {
  //     onAddJobClick();
  //   }
  // }, [isLoggedIn]);

  useDidMountEffect(() => {
    animate();
  }, [newSubmittedJob]);

  newJobLoadingAnimatedValue.addListener(({ value }) => {
    setNewJobLoadingProgress(value);
  });

  const animate = useCallback(() => {
    newJobLoadingAnimatedValue.setValue(0.01);
    Animated.timing(newJobLoadingAnimatedValue, {
      toValue: 0.85,
      duration: 2000,
      useNativeDriver: true,
      easing: Easing.linear,
    }).start();
  }, [newJobLoadingAnimatedValue]);

  // const selectJob = useCallback(
  //   (selectedJob: TJob) => {
  //     if (!isSelectJobLoading) {
  //       setIsSelectJobLoading(true);
  //       UsersService.onSelectJob({
  //         preferences: selectedJob?.preferences,
  //         jobId: selectedJob?._id,
  //       })
  //         .then(data => {
  //           setIsSelectJobLoading(false);
  //           dispatch(setSwipingDataRedux(data?.employeesForSwiping));
  //           dispatch(setSelectedJob(data?.jobData));
  //           dispatch(setMatches(data?.jobData?.matches));
  //           dispatch(setIsJobBoardOpen(false));
  //           navigation.navigate('Root', { screen: 'Job Board' });
  //         })
  //         .catch((error: string) => {
  //           setIsSelectJobLoading(false);
  //           console.error('There was an error selecting job' + error);
  //         });
  //     }
  //   },
  //   [dispatch, isSelectJobLoading, navigation],
  // );

  const closeJobItemModal = useCallback(() => {
    // setSelectedJobForMenu(undefined);
    fadeAnim.setValue(1);
  }, [fadeAnim]);

  const onPreviewJobPress = useCallback(
    (job: TJob) => {
      if (job) {
        navigation.navigate('ViewJobPosting', {
          job,
        });
      }
      closeJobItemModal();
    },
    [closeJobItemModal, navigation],
  );

  const onJobListingPress = useCallback(
    (job: TJob) => {
      if (job._id) {
        if (jobMenusOpen.includes(job._id)) {
          const filteredJobMenusOpen = jobMenusOpen.filter(e => e !== job._id);
          setJobMenusOpen(filteredJobMenusOpen);
        } else {
          setJobMenusOpen(prev => [...prev, job._id as string]);
        }
      }
    },
    [jobMenusOpen],
  );

  const assignColor = useCallback(() => {
    if (employersJobs && employersJobs.length > 0) {
      const lastFiveJobs = employersJobs.slice(-5);
      const latestFiveColors = lastFiveJobs.map((job: TJob) => job.color);
      let newColor = '';
      jobColors.forEach((color: string) => {
        if (!latestFiveColors.includes(color)) {
          newColor = color;
        }
      });
      if (!newColor) {
        newColor = latestFiveColors[0];
      }
      setJobColor(newColor);
    } else {
      setJobColor('#acfcf2');
    }
  }, [employersJobs]);

  const onAddJobClick = useCallback(() => {
    assignColor();
    setAddJobModalVisible(true);
  }, [assignColor]);

  // const onDeleteJobPress = useCallback(
  //   async (selectedJob: TJob) => {
  //     try {
  //       setIsDeleting(true);
  //       // Start the deletion animation
  //       setDeletedJob(selectedJob);

  //       // Trigger the API call to delete the job
  //       const deleteJobPromise = JobsService.deleteJob({ jobId: selectedJob._id || '' });

  //       // // Wait for the animation to finish before going ahead with the deletion
  //       // await new Promise(resolve => {
  //       //   deleteJobLoadingAnimatedValue.setValue(0.01);
  //       //   Animated.timing(deleteJobLoadingAnimatedValue, {
  //       //     toValue: 1,
  //       //     duration: 3000, // Adjust duration as needed
  //       //     useNativeDriver: true,
  //       //     easing: Easing.linear,
  //       //   }).start(resolve);
  //       // });

  //       // Wait for the API call to delete the job to complete
  //       await deleteJobPromise;

  //       // After animation completes and API call is done, update the UI
  //       dispatch(deleteJobRedux({ jobId: selectedJob._id || '' }));
  //       dispatch(unselectJobRedux());
  //     } catch (error) {
  //       // Handle error if needed
  //     } finally {
  //       // Reset state and stop loading animation
  //       setIsDeleting(false);
  //       setDeletedJob(undefined);
  //     }
  //   },
  //   [dispatch],
  // );

  const returnJobs = useCallback(() => {
    if (employersJobs && employersJobs.length > 0) {
      // // Filter out the job being deleted
      // const filteredJobs = employersJobsTemp.filter(job => job._id !== deletedJob?._id);
      const employersJobsTemp = [...employersJobs];
      return employersJobsTemp
        .reverse()
        .map((job, index) => (
          <JobBoardListing
            key={job._id}
            index={index}
            job={job}
            onPreviewJobPress={onPreviewJobPress}
            onJobListingPress={onJobListingPress}
          />
        ));
    }
  }, [employersJobs, onJobListingPress, onPreviewJobPress]);

  const returnAddJobText = useCallback(() => {
    if (!newSubmittedJob) {
      return (
        <View style={styles.createJobTextContainer}>
          <AppHeaderText style={styles.createJobText}>Add a Job to Start Swiping!</AppHeaderText>
          <AntDesign name='arrowdown' size={40} color='white' />
        </View>
      );
    }
  }, [newSubmittedJob, styles.createJobText, styles.createJobTextContainer]);

  // const returnTapOnJobText = useCallback(() => {
  //   if (!newSubmittedJob) {
  //     return (
  //       <View style={styles.createJobTextContainer}>
  //         <AntDesign name='arrowup' size={40} color='white' />
  //         <AppHeaderText style={styles.createJobText}>Tap on a Job to See Candidates!</AppHeaderText>
  //       </View>
  //     );
  //   }
  // }, [newSubmittedJob, styles.createJobText, styles.createJobTextContainer]);

  const openSettings = useCallback(() => {
    setIsSettingsModalOpen(true);
  }, []);

  const closeSettings = useCallback(() => {
    setIsSettingsModalOpen(false);
  }, []);

  const onKeeperProPress = useCallback(() => {
    setIsKeeperProModalOpen(true);
  }, []);

  const closeKeeperProModal = useCallback(() => {
    setIsKeeperProModalOpen(false);
  }, []);

  const closeAddJobModal = useCallback(() => {
    setAddJobModalVisible(false);
    // setSelectedJobForMenu(undefined);
  }, []);

  useEffect(() => {
    if (isEmployerNew) {
      setAddJobModalVisible(true);
    }
  }, []);

  return (
    <View style={styles.jobBoardModal}>
      <SettingsModal
        isSettingsModalOpen={isSettingsModalOpen}
        closeSettings={closeSettings}
        isKeeperProModalOpen={isKeeperProModalOpen}
        closeKeeperProModal={closeKeeperProModal}
        onKeeperProPress={onKeeperProPress}
      />

      <View style={styles.container}>
        {employersJobs && employersJobs.length === 0 && returnAddJobText()}
        <KeeperSelectButton buttonStyles={styles.addNewJobButton} onPress={onAddJobClick} title='ADD NEW JOB' />
        <View style={styles.scrollViewContainer}>
          {!employersJobs && <ActivityIndicator color='black' size='large' style={styles.spinner} />}
          <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.cogIconTouchable} onPress={openSettings} hitSlop={30}>
              <CogIcon style={styles.cogIconStyles} />
            </TouchableOpacity>
            <RedesignHeader title='JOB BOARD' containerStyles={styles.header} />

            {/* this only appears when you add a new job briefly until that job is made,
            then it is the empty job that is being filled in with color, once its complete
            this dissapears and the job is added to emploeyrs jobs and the above loop is called again */}
            {newSubmittedJob && newSubmittedJob?.color && (
              <LinearGradient
                locations={[0.01, 0.01]}
                colors={['grey', newSubmittedJob?.color]}
                start={{ x: newJobLoadingProgress, y: 1 }}
                style={{ borderRadius: 27, marginBottom: 10 }}
                end={{ x: 0, y: 1 }}>
                <JobBoardListing job={newSubmittedJob} isNewJob />
              </LinearGradient>
            )}
            {/* {deletedJob && deletedJob?.color && (
              <LinearGradient
                locations={[0.01, 0.01]}
                colors={['grey', deletedJob?.color]}
                start={{ x: 1 - deletedJobLoadingProgress, y: 1 }}
                style={{ borderRadius: 27, marginBottom: 10 }}
                end={{ x: 0, y: 1 }}>
                <JobBoardListing job={deletedJob} isNewJob />
              </LinearGradient>
            )} */}

            {employersJobs && employersJobs.length > 0 && returnJobs()}

            {/* {deletedJob && deletedJob?.color && (
              <JobBoardListingWithGradient jobLoadingProgress={deletedJobLoadingProgress} job={deletedJob} isNewJob />
            )} */}
            {/* {employersJobs && employersJobs.length === 1 && returnTapOnJobText()} */}
          </ScrollView>
        </View>
      </View>

      {addJobModalVisible && (
        <AddJob
          setNewSubmittedJob={setNewSubmittedJob}
          jobColor={jobColor}
          addJobModalVisible={addJobModalVisible}
          closeAddJobModal={closeAddJobModal}
        />
      )}
      {/* {isEditJobModalOpen && selectedJobForMenu && (
        <AddJob
          addJobModalVisible={isEditJobModalOpen}
          setAddJobModalVisible={setIsEditJobModalOpen}
          closeAddJobModal={closeAddJobModal}
          jobColor={jobColor}
          editJobData={{ jobSettings: selectedJobForMenu.settings, _id: selectedJobForMenu._id }}
        />
      )} */}
    </View>
  );
};

export default memo(JobBoard);
