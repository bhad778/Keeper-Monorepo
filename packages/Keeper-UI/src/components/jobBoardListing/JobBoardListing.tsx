import React, { memo, useCallback, useState } from 'react';
import { Animated, View, TouchableOpacity, Easing } from 'react-native';
import { KeeperSelectButton } from 'components';
import { TJob } from 'types';
import { AppHeaderText } from 'components';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { useDidMountEffect, useEmployer } from 'hooks';
import { useNavigation } from '@react-navigation/native';
import { RootState } from 'reduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { unselectJobRedux, deleteJobRedux } from 'reduxStore';
import { JobsService } from 'services';

import useStyles from './JobBoardListingStyles';
import UpRightArrowWhite from '../../assets/svgs/arrow_right_white.svg';
import { LinearGradient } from 'expo-linear-gradient';

type TJobBoardListing = {
  job: TJob;
  index?: number;
  isNewJob?: boolean;
  onJobListingPress?: (selectedJob: TJob) => void;
  onPreviewJobPress?: (job: TJob) => void;
  closeAllMenuItems?: () => void;
  closeOneJobMenuById?: (jobId: string) => void;
};

const JobBoardListing = ({ job, index, isNewJob, onJobListingPress, onPreviewJobPress }: TJobBoardListing) => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);

  const [opacityAnimValue] = useState(new Animated.Value(0));
  const [isJobMenuOpen, setIsJobMenuOpen] = useState(false);
  const [deleteJobLoadingAnimatedValue] = useState(new Animated.Value(0.01));
  const [deletedJobLoadingProgress, setDeletedJobLoadingProgress] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletedJob, setDeletedJob] = useState<TJob>();
  const dispatch = useDispatch();

  const { setSelectedJob, unselectJob } = useEmployer();
  const navigation = useNavigation();
  const styles = useStyles(job?.settings?.title.length, opacityAnimValue, isDeleting);

  useDidMountEffect(() => {
    if (isJobMenuOpen) {
      openJobMenu();
    } else {
      closeJobMenu();
    }
  }, [isJobMenuOpen]);

  const onDeleteJobPress = useCallback(
    async (selectedJob: TJob) => {
      try {
        setIsDeleting(true);
        // Start the deletion animation
        setDeletedJob(selectedJob);

        // Trigger the API call to delete the job
        const deleteJobPromise = JobsService.deleteJob({ jobId: selectedJob._id || '' });

        // Wait for the animation to finish before going ahead with the deletion
        await new Promise(resolve => {
          deleteJobLoadingAnimatedValue.setValue(0.01);
          Animated.timing(deleteJobLoadingAnimatedValue, {
            toValue: 1,
            duration: 3000, // Adjust duration as needed
            useNativeDriver: true,
            easing: Easing.linear,
          }).start(resolve);
        });

        // Wait for the API call to delete the job to complete
        await deleteJobPromise;

        // After animation completes and API call is done, update the UI
        dispatch(deleteJobRedux({ jobId: selectedJob._id || '' }));
        dispatch(unselectJobRedux());
      } catch (error) {
        console.error(error);
        // Handle error if needed
      } finally {
        // Reset state and stop loading animation
        setIsDeleting(false);
        setDeletedJob(undefined);
      }
    },
    [dispatch, deleteJobLoadingAnimatedValue],
  );

  const returnJobListingNumber = useCallback(() => {
    if (isNewJob) {
      return 0;
    } else if (typeof index != 'undefined') {
      return index + 1 >= 10 ? index + 1 : `0${index + 1}`;
    } else {
      return 0;
    }
  }, [index, isNewJob]);

  const returnTouchableStyles = useCallback(() => {
    if (isNewJob || isDeleting) {
      return styles.jobListingTouchable;
    } else {
      return [styles.jobListingTouchable, { backgroundColor: job.color }];
    }
  }, [isNewJob, job.color, isDeleting, styles.jobListingTouchable]);

  deleteJobLoadingAnimatedValue.addListener(({ value }) => {
    setDeletedJobLoadingProgress(value);
  });

  const openJobMenu = useCallback(() => {
    Animated.timing(opacityAnimValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacityAnimValue]);

  const closeJobMenu = useCallback(() => {
    Animated.timing(opacityAnimValue, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [opacityAnimValue]);

  const toggleJobMenuOpen = useCallback(() => {
    setIsJobMenuOpen(prev => !prev);
  }, []);

  const localOnJobListingPress = useCallback(
    (selectedJob: TJob) => {
      if (isNewJob) {
        return;
      } else {
        onJobListingPress(selectedJob);
        toggleJobMenuOpen();
      }
    },
    [isNewJob, onJobListingPress, toggleJobMenuOpen],
  );

  const localOnPreviewJobPress = (event: React.MouseEvent<HTMLElement>) => {
    toggleJobMenuOpen();

    if (!isJobMenuOpen) {
      return;
    }

    if (event && event.stopPropagation) {
      event?.stopPropagation();
    }

    if (onPreviewJobPress) {
      onPreviewJobPress(job);
    }
  };

  const localOnDeleteJobPress = (event: React.MouseEvent<HTMLElement>) => {
    toggleJobMenuOpen();

    if (!isJobMenuOpen) {
      return;
    } else {
      if (event && event.stopPropagation) {
        event?.stopPropagation();
      }

      // if we deleted our only job then unselectJob in redux to get browsing data back in discover
      // else if we deleted the job we had selected then select the first job we have which is default
      // behavior inside the setSelectedJob function
      if (employersJobs && employersJobs.length === 1) {
        unselectJob();
      } else if (selectedJobId === job._id) {
        // if you are deleting the first job, set the next selectedJob to the second job, not the first which you are now deleting
        let newSelectedJob: TJob | undefined = employersJobs ? employersJobs[0] : undefined;
        if (newSelectedJob?._id === job._id) {
          newSelectedJob = employersJobs ? employersJobs[1] : undefined;
        }

        setSelectedJob(newSelectedJob);
      }
      onDeleteJobPress(job);
    }
  };

  // useDidMountEffect(() => {
  //   deleteAnimate();
  // }, [onDeleteJobPress]);
  const localOnCandidatesPress = () => {
    toggleJobMenuOpen();
    if (!isJobMenuOpen) {
      return;
    } else {
      setSelectedJob(job);

      navigation.navigate('Root', { screen: 'Discover' });
    }
  };

  const localOnMatchesPress = () => {
    toggleJobMenuOpen();

    if (!isJobMenuOpen) {
      return;
    }

    navigation.navigate('Root', { screen: 'Matches' });
  };

  return isDeleting ? (
    <LinearGradient
      locations={[0.01, 0.01]}
      colors={['grey', job?.color]}
      start={{ x: 1 - deletedJobLoadingProgress, y: 1 }}
      style={{ borderRadius: 27, marginBottom: 10 }}
      end={{ x: 0, y: 1 }}>
      <TouchableOpacity
        style={returnTouchableStyles()}
        onPress={() => localOnJobListingPress(job)}
        key={index}
        activeOpacity={1}
        hitSlop={{ right: 30, left: 30 }}>
        <Animated.View style={styles.jobListingMenuAnimatedView}>
          <View style={styles.xCircle}>
            <Fontisto name='close-a' size={10} color='white' />
          </View>
          <View style={styles.jobMenuButtonsContainer}>
            <KeeperSelectButton
              onPress={localOnPreviewJobPress}
              title='Preview / Edit'
              buttonStyles={styles.jobMenuButton}
            />
            <KeeperSelectButton
              onPress={localOnCandidatesPress}
              title='Candidates'
              buttonStyles={styles.jobMenuButton}
            />
            <KeeperSelectButton onPress={localOnMatchesPress} title='Matches' buttonStyles={styles.jobMenuButton} />
            <KeeperSelectButton onPress={localOnDeleteJobPress} title='Delete' buttonStyles={styles.jobMenuButton} />
          </View>
        </Animated.View>
        <View style={styles.blackCircle}>
          <UpRightArrowWhite style={styles.arrowSvg} />
        </View>
        <View style={styles.jobListing}>
          <View style={styles.jobListingTop}>
            <AppHeaderText style={styles.jobListingNumber}>{returnJobListingNumber()}</AppHeaderText>
          </View>
          <View style={styles.jobListingMiddle}>
            <AppHeaderText numberOfLines={3} style={styles.jobListingTitle}>
              {job.settings.title ? job?.settings?.title : ''}
            </AppHeaderText>
          </View>
          <View style={styles.jobListingBottom}>
            <AppHeaderText style={styles.jobListingCompanyName}>{job?.settings?.companyName}</AppHeaderText>
          </View>
        </View>
      </TouchableOpacity>
    </LinearGradient>
  ) : (
    <TouchableOpacity
      style={returnTouchableStyles()}
      onPress={() => localOnJobListingPress(job)}
      key={index}
      activeOpacity={1}
      hitSlop={{ right: 30, left: 30 }}>
      <Animated.View style={styles.jobListingMenuAnimatedView}>
        <View style={styles.xCircle}>
          <Fontisto name='close-a' size={10} color='white' />
        </View>
        <View style={styles.jobMenuButtonsContainer}>
          <KeeperSelectButton
            onPress={localOnPreviewJobPress}
            title='Preview / Edit'
            buttonStyles={styles.jobMenuButton}
          />
          <KeeperSelectButton onPress={localOnCandidatesPress} title='Candidates' buttonStyles={styles.jobMenuButton} />
          <KeeperSelectButton onPress={localOnMatchesPress} title='Matches' buttonStyles={styles.jobMenuButton} />
          <KeeperSelectButton onPress={localOnDeleteJobPress} title='Delete' buttonStyles={styles.jobMenuButton} />
        </View>
      </Animated.View>
      <View style={styles.blackCircle}>
        <UpRightArrowWhite style={styles.arrowSvg} />
      </View>
      <View style={styles.jobListing}>
        <View style={styles.jobListingTop}>
          <AppHeaderText style={styles.jobListingNumber}>{returnJobListingNumber()}</AppHeaderText>
        </View>
        <View style={styles.jobListingMiddle}>
          <AppHeaderText numberOfLines={3} style={styles.jobListingTitle}>
            {job.settings.title ? job?.settings?.title : ''}
          </AppHeaderText>
        </View>
        <View style={styles.jobListingBottom}>
          <AppHeaderText style={styles.jobListingCompanyName}>{job?.settings?.companyName}</AppHeaderText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(JobBoardListing);
