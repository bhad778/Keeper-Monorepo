import { AppHeaderText, JobBoardListing, KeeperSelectButton, SpinnerOverlay } from 'components';
import { RootState } from 'reduxStore/store';
import { useDispatch, useSelector } from 'react-redux';
import { jobColors } from 'constants/globalConstants';
import { useEffect, useRef, useState } from 'react';
import { TJob } from 'types';
import { MiscService } from 'services';
import { AddJob } from 'screens';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { gsap } from 'gsap';
import { useDidMountEffect } from 'hooks';

import useStyles from './JobBoardStyles';

const JobBoard = () => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);
  const selectedJobId = useSelector((state: RootState) => state?.local?.selectedJob?._id);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);

  const [isSelectJobLoading, setIsSelectJobLoading] = useState(false);
  const [isLoading] = useState(false);
  const [selectedJobForMenu, setSelectedJobForMenu] = useState<TJob | undefined>(undefined);
  const [jobColor, setJobColor] = useState('');
  const [isPreviewJobModalOpen, setIsPreviewJobModalOpen] = useState(false);
  const [newSubmittedJob, setNewSubmittedJob] = useState<TJob>();
  const [addJobModalVisible, setAddJobModalVisible] = useState(false);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [jobMenusOpen, setJobMenusOpen] = useState<string[]>([]);

  const isJobSelected = !!selectedJobId;

  const styles = useStyles(isEditJobModalOpen || addJobModalVisible || isPreviewJobModalOpen);
  const dispatch = useDispatch();
  const animatedContainerRef = useRef(null);

  useEffect(() => {
    if (isEmployerNew) {
      setAddJobModalVisible(true);
    }
  }, [isEmployerNew]);

  useDidMountEffect(() => {
    if (newSubmittedJob) {
      runNewJobAnimation();
    }
  }, [newSubmittedJob]);

  const runNewJobAnimation = () => {
    // this duration of 2 needs to correspond with the delay on padToTime in onDeleteJobPress function
    gsap.fromTo(animatedContainerRef.current, { width: 0 }, { width: '90%', duration: 2, ease: 'expo' });
  };

  // const selectJob = (selectedJob: TJob) => {
  //   if (!isSelectJobLoading) {
  //     setIsSelectJobLoading(true);
  //     UsersService.onSelectJob({
  //       preferences: selectedJob?.preferences,
  //       jobId: selectedJob?._id,
  //     })
  //       .then((data) => {
  //         if (data) {
  //           setIsSelectJobLoading(false);
  //           dispatch(setSwipingDataRedux(data?.employeesForSwiping));
  //           dispatch(setSelectedJob(data?.jobData));
  //           dispatch(setMatches(data?.jobData?.matches));
  //         }
  //       })
  //       .catch((error: string) => {
  //         setIsSelectJobLoading(false);
  //         console.error('There was an error selecting job' + error);
  //       });
  //   }
  // };

  const assignColor = () => {
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
  };

  const returnJobs = () => {
    if (employersJobs && employersJobs.length > 0) {
      const employersJobsTemp = [...employersJobs];
      return employersJobsTemp
        .reverse()
        .map((job, index) => (
          <JobBoardListing
            key={job._id}
            index={index}
            job={job}
            onJobItemMenuPress={onJobItemMenuPress}
            jobMenusOpen={jobMenusOpen}
            onPreviewJobPress={onPreviewJobPress}
            onEditJobPress={onEditJobPress}
          />
        ));
    }
  };

  const returnAddJobText = () => {
    if (!newSubmittedJob) {
      return (
        <div style={styles.noJobsTextContainer}>
          <ArrowUpwardIcon sx={styles.arrowUpwardIcon} />
          <AppHeaderText style={styles.noJobsText}>
            Add a job to get a tailored feed of candidates for each job
          </AppHeaderText>
        </div>
      );
    }
  };

  const returnTapOnJobText = () => {
    if (!newSubmittedJob) {
      return (
        <div style={styles.noJobsTextContainer}>
          <ArrowUpwardIcon sx={styles.arrowUpwardIcon} />
          <AppHeaderText style={styles.noJobsText}>Click on a Job to See Candidates!</AppHeaderText>
        </div>
      );
    }
  };

  const onJobItemMenuPress = (job: TJob) => {
    if (job._id) {
      if (jobMenusOpen.includes(job._id)) {
        const filteredJobMenusOpen = jobMenusOpen.filter((e) => e !== job._id);
        setJobMenusOpen(filteredJobMenusOpen);
      } else {
        setJobMenusOpen((prev) => [...prev, job._id as string]);
      }
    }
  };

  const closeOneJobMenuById = (jobId: string) => {
    // it should always include jobId but just as a check
    if (jobMenusOpen.includes(jobId)) {
      const filteredJobMenusOpen = jobMenusOpen.filter((e) => e !== jobId);
      setJobMenusOpen(filteredJobMenusOpen);
    }
  };

  const closeJobItemModal = () => {
    setSelectedJobForMenu(undefined);
  };

  const onPreviewJobPress = (job: TJob) => {
    setSelectedJobForMenu(job);
    setIsPreviewJobModalOpen(true);
  };

  const onEditJobPress = (job: TJob) => {
    setSelectedJobForMenu(job);
    setIsEditJobModalOpen(true);
  };

  const onAddJobClick = () => {
    assignColor();
    setAddJobModalVisible(true);

    // this just makes the api call warm
    MiscService.getGoogleMapsLocations({ locationText: '', isPing: true });
  };

  const onBackClick = () => {
    setIsPreviewJobModalOpen(false);
    setAddJobModalVisible(false);
    setIsEditJobModalOpen(false);

    closeJobItemModal();
  };

  const returnBaseUi = () => {
    if (isPreviewJobModalOpen && selectedJobForMenu) {
      return (
        <AddJob
          cameFromPreviewPress
          jobColor={jobColor}
          closeModal={onBackClick}
          editJobData={{
            jobSettings: selectedJobForMenu?.settings,
            _id: selectedJobForMenu?._id,
          }}
        />
      );
    } else {
      if (addJobModalVisible) {
        return (
          <AddJob
            jobColor={jobColor}
            closeModal={onBackClick}
            setNewSubmittedJob={setNewSubmittedJob}
            editJobData={{
              jobSettings: selectedJobForMenu?.settings,
              _id: selectedJobForMenu?._id,
            }}
          />
        );
      } else if (isEditJobModalOpen && selectedJobForMenu) {
        return (
          <AddJob
            jobColor={jobColor}
            closeModal={onBackClick}
            editJobData={{
              jobSettings: selectedJobForMenu?.settings,
              _id: selectedJobForMenu?._id,
            }}
          />
        );
      }

      return (
        <div style={styles.employersJobsContainer}>
          <div style={styles.createNewJobButtonContainer}>
            <KeeperSelectButton onClick={onAddJobClick} title="Add New Job" buttonStyles={styles.createNewJobButton} />
          </div>
          {newSubmittedJob && newSubmittedJob?.color && (
            <JobBoardListing ref={animatedContainerRef} job={newSubmittedJob} isNewJob />
          )}
          {employersJobs && employersJobs.length > 0 && returnJobs()}
          {employersJobs && employersJobs.length === 0 && returnAddJobText()}
          {/* {employersJobs && employersJobs.length === 1 && returnTapOnJobText()} */}
        </div>
      );
    }
  };

  // if (isSelectJobLoading) {
  //   return <LoadingScreen />;
  // }

  return (
    <div style={styles.container}>
      {isLoading && <SpinnerOverlay />}
      {returnBaseUi()}
    </div>
  );
};

export default JobBoard;
