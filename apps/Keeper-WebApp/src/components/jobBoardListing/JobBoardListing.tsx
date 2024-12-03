import { TJob } from 'keeperTypes';
import { AppHeaderText, Clickable } from 'components';
import { LegacyRef, forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { JobsService } from 'services';
import { padToTime } from 'utils/globalUtils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, deleteJobRedux } from 'reduxStore';
import toast from 'react-hot-toast';
import { useEmployer } from 'hooks';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

import useStyles from './JobBoardListingStyles';

type TJobBoardListing = {
  job: TJob;
  index?: number;
  isNewJob?: boolean;
  jobMenusOpen?: string[];
  onJobItemMenuPress?: (job: TJob) => void;
  onPreviewJobPress?: (job: TJob) => void;
  onEditJobPress?: (job: TJob) => void;
};

const JobBoardListing = forwardRef(
  (
    { job, index, isNewJob, jobMenusOpen, onPreviewJobPress, onEditJobPress }: TJobBoardListing,
    ref: LegacyRef<HTMLDivElement> | undefined,
  ) => {
    const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);
    const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

    const [isDeleteJobAnimationHappening, setIsDeleteJobAnimationHappening] = useState(false);

    const isJobMenuOpen = jobMenusOpen && jobMenusOpen.includes(job._id as string);

    const styles = useStyles(job.color, !!isJobMenuOpen, isDeleteJobAnimationHappening || !!isNewJob);

    const navigate = useNavigate();
    const { setSelectedJob, unselectJob } = useEmployer();
    const jobMenuAnimationRef = useRef(null);
    const deleteJobRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
      if (job._id && isJobMenuOpen) {
        runOpenJobMenuAnimation();
      } else {
        // runCloseJobMenuAnimation();
      }
    }, [jobMenusOpen]);

    const returnJobListingNumber = useCallback(() => {
      if (isNewJob) {
        return '';
      } else if (typeof index != 'undefined') {
        return index + 1 >= 10 ? index + 1 : `0${index + 1}`;
      } else {
        return 0;
      }
    }, [index, isNewJob]);

    const runOpenJobMenuAnimation = useCallback(() => {
      // this duration of 2 needs to correspond with the delay on padToTime in onDeleteJobPress function
      gsap.to(jobMenuAnimationRef.current, { right: 0, duration: 0.5, ease: 'ease' });
    }, []);

    const runCloseJobMenuAnimation = useCallback(() => {
      // this duration of 2 needs to correspond with the delay on padToTime in onDeleteJobPress function
      gsap.to(jobMenuAnimationRef.current, { right: -280, duration: 0.5, ease: 'ease' });
    }, []);

    const localOnPreviewJobPress = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        if (onPreviewJobPress) {
          onPreviewJobPress(job);
        }
      },
      [job, onPreviewJobPress],
    );

    const localOnEditJobPress = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        if (onEditJobPress) {
          onEditJobPress(job);
        }
      },
      [job, onEditJobPress],
    );

    const runDeleteJobAnimation = useCallback(() => {
      setIsDeleteJobAnimationHappening(true);
      gsap.fromTo(deleteJobRef.current, { width: '100%' }, { width: '10%', duration: 2, ease: 'expo' });
    }, []);

    const localOnDeleteJobPress = useCallback(
      (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        // if we deleted our only job then unselectJob in redux to get browsing data back in discover
        // else if we deleted the job we had selected then select the first job we have which is default
        // behavior inside the setSelectedJob function
        if (employersJobs && employersJobs.length <= 1) {
          unselectJob();
        } else if (selectedJobId === job._id) {
          // if you are deleting the first job, set the next selectedJob to the second job, not the first which you are now deleting
          let newSelectedJob: TJob | undefined = employersJobs ? employersJobs[0] : undefined;
          if (newSelectedJob?._id === job._id) {
            newSelectedJob = employersJobs ? employersJobs[1] : undefined;
          }

          setSelectedJob(newSelectedJob);
        }

        runDeleteJobAnimation();

        const JobsServicePromise = JobsService.deleteJob({ jobId: job._id || '' });

        padToTime([JobsServicePromise], 2000)
          .then(() => {
            dispatch(deleteJobRedux({ jobId: job._id || '' }));
          })
          .catch(error => {
            toast.error('Error deleting job: ' + error);
          });
      },
      [dispatch, employersJobs, job._id, runDeleteJobAnimation, selectedJobId, setSelectedJob, unselectJob],
    );

    const localOnCandidatesPress = useCallback(() => {
      setSelectedJob(job);

      navigate('/employerHome/discover');
    }, [job, navigate, setSelectedJob]);

    const localOnMatchesPress = useCallback(() => {
      navigate('/employerHome/matches');
    }, [navigate]);

    return (
      // <Clickable onClick={returnOnJobListingPress}>
      <div style={styles.jobListingTouchable} key={index}>
        <Clickable onClick={localOnDeleteJobPress} style={styles.xIconContainer}>
          <CloseIcon />
        </Clickable>
        <div style={styles.newJobBackgroundAnimatedOverlay} ref={ref} />
        <div style={styles.deleteJobBackgroundAnimatedOverlay} ref={deleteJobRef} />
        {!isNewJob && (
          <div style={styles.jobMenuAnimatedOverlay}>
            <Clickable onClick={localOnPreviewJobPress} style={styles.jobRightSideButtons}>
              <AppHeaderText className='jobBoardListingButtonsText' style={styles.jobBoardListingButtonsText}>
                Preview
              </AppHeaderText>
            </Clickable>
            <Clickable onClick={localOnEditJobPress} style={styles.jobRightSideButtons}>
              <AppHeaderText className='jobBoardListingButtonsText' style={styles.jobBoardListingButtonsText}>
                Edit
              </AppHeaderText>
            </Clickable>
            {/* <Clickable onClick={localOnDeleteJobPress} style={styles.jobRightSideButtons}>
              <AppHeaderText className="jobBoardListingButtonsText" style={styles.jobBoardListingButtonsText}>
                Delete
              </AppHeaderText>
            </Clickable> */}
            <Clickable onClick={localOnCandidatesPress} style={styles.jobRightSideButtons}>
              <AppHeaderText className='jobBoardListingButtonsText' style={styles.jobBoardListingButtonsText}>
                Candidates
              </AppHeaderText>
            </Clickable>
            <Clickable onClick={localOnMatchesPress} style={styles.jobRightSideButtons}>
              <AppHeaderText className='jobBoardListingButtonsText' style={styles.jobBoardListingButtonsText}>
                Matches
              </AppHeaderText>
            </Clickable>
            {/* <ModalRow onClick={localOnPreviewJobPress} style={styles.modalRowItem} title="Preview Job" />
              <ModalRow onClick={localOnEditJobPress} style={styles.modalRowItem} title="Edit Job" />
              <ModalRow onClick={localOnDeleteJobPress} style={styles.modalRowItem} title="Delete Job" isLastRow /> */}
          </div>
        )}

        {/* {!isNewJob && (
            <div style={styles.ellipsisContainer} onClick={onEllipsisPress}>
              <MoreVertIcon sx={styles.ellipsis} />
            </div>
          )} */}
        <div style={styles.jobListing}>
          <div style={styles.jobListingTop}>
            <AppHeaderText style={styles.jobListingNumber}>{returnJobListingNumber()}</AppHeaderText>
          </div>
          <div style={styles.jobListingMiddle}>
            <AppHeaderText style={styles.jobListingTitle}>
              {job.settings.title ? job?.settings?.title : ''}
            </AppHeaderText>
          </div>
          <div style={styles.jobListingBottom}>
            <AppHeaderText style={styles.jobListingCompanyName}>{job?.settings?.companyName}</AppHeaderText>
          </div>
        </div>
      </div>
      // </Clickable>
    );
  },
);

export default JobBoardListing;
