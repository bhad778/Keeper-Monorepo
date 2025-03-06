import { useState, useCallback, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { TJob } from 'keeperTypes';
import { JobsService, ApplicationsService, TGetJobsForSwipingPayload } from 'keeperServices';
import { useDebounce } from 'hooks';

const ITEMS_PER_PAGE = 30;

export const useJobData = (filters: TGetJobsForSwipingPayload) => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);

  // Job display state
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isNotLoggedInAlertOpen, setIsNotLoggedInAlertOpen] = useState(false);

  const loadingMoreRef = useRef(false);

  // Create a callback for fetching jobs
  const handleFetchJobs = useCallback(() => {
    fetchJobs(filters);
  }, [filters]);

  // Create a debounced version of the fetch function
  const debouncedFetchJobs = useDebounce(handleFetchJobs, 500);

  // Call the debounced function when filters change
  useEffect(() => {
    debouncedFetchJobs();
  }, [filters]);

  // Fetch jobs from API
  const fetchJobs = async (updatedFilters: TGetJobsForSwipingPayload) => {
    try {
      setLoading(true);
      const response = await JobsService.getJobsForSwiping(updatedFilters);

      if (response?.data) {
        setJobs(response.data);
        setDisplayedJobs(response.data.slice(0, ITEMS_PER_PAGE));
      } else {
        setJobs([]);
        setDisplayedJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
      setDisplayedJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Load more jobs when user scrolls
  const loadMoreJobs = useCallback(() => {
    if (loadingMoreRef.current || displayedJobs.length >= jobs.length) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);

    setTimeout(() => {
      setDisplayedJobs(prevDisplayedJobs => {
        const nextPageJobs = jobs.slice(prevDisplayedJobs.length, prevDisplayedJobs.length + ITEMS_PER_PAGE);
        loadingMoreRef.current = false;
        setLoadingMore(false);
        return [...prevDisplayedJobs, ...nextPageJobs];
      });
    }, 500);
  }, [jobs, displayedJobs]);

  // Handle job application
  const handleApplyClick = (job: TJob) => {
    if (isLoggedIn) {
      ApplicationsService.addApplication({
        jobId: job._id || '',
        employeeId: employeeId || '',
      });
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      setIsNotLoggedInAlertOpen(true);
    }
  };

  return {
    jobs,
    displayedJobs,
    loading,
    loadingMore,
    isNotLoggedInAlertOpen,
    setIsNotLoggedInAlertOpen,
    fetchJobs,
    loadMoreJobs,
    handleApplyClick,
  };
};
