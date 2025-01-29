import { useEffect, useState, useCallback, useRef } from 'react';
import { TGetJobsForSwipingPayload, JobsService } from 'keeperServices';
import { LoadingSpinner } from 'components';
import { JobLevel, TJob } from 'keeperTypes';

import useStyles from './FindJobsStyles';

const defaultPayload: TGetJobsForSwipingPayload = {
  userId: '6789b086457faa1335ce57d8',
  textSearch: 'react',
};

const ITEMS_PER_PAGE = 30;
const PRELOAD_OFFSET = 2000; // Load next batch when 500px from bottom

const FindJob = () => {
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);

  const loadingMoreRef = useRef(false); // Prevent multiple triggers
  const jobGridRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling container

  const styles = useStyles();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await JobsService.getJobsForSwiping(defaultPayload);
        setJobs(response.data || []);
        setDisplayedJobs((response.data || []).slice(0, ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const loadMoreJobs = useCallback(() => {
    if (loadingMoreRef.current || displayedJobs.length >= jobs.length) return; // Stop if already loading or all jobs are loaded

    loadingMoreRef.current = true;
    setLoadingMore(true);

    setTimeout(() => {
      setDisplayedJobs(prevDisplayedJobs => {
        const nextPageJobs = jobs.slice(prevDisplayedJobs.length, prevDisplayedJobs.length + ITEMS_PER_PAGE);
        loadingMoreRef.current = false;
        setLoadingMore(false);
        return [...prevDisplayedJobs, ...nextPageJobs];
      });
    }, 500); // Small delay for smooth loading
  }, [jobs, displayedJobs]);

  useEffect(() => {
    const handleScroll = () => {
      if (!jobGridRef.current) return;

      const { scrollTop, scrollHeight, clientHeight } = jobGridRef.current;

      if (scrollTop + clientHeight >= scrollHeight - PRELOAD_OFFSET) {
        loadMoreJobs();
      }
    };

    const jobGridElement = jobGridRef.current;
    if (jobGridElement) {
      jobGridElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (jobGridElement) {
        jobGridElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMoreJobs]);

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.fullPageSpinner}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {/* Sidebar with Search and Filters */}
          <div style={styles.sidebar}>
            <input type='text' placeholder='Search jobs...' style={styles.searchBar} />

            {/* Job Level Filter */}
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>Job Level</h3>
              <div style={styles.filterOptions}>
                {Object.values(JobLevel).map(level => (
                  <button key={level} style={styles.filterButton}>
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>Location</h3>
              <input type='text' placeholder='Search cities...' style={styles.locationSearch} />
            </div>

            {/* Location Flexibility Filter */}
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>Location Flexibility</h3>
              <div style={styles.filterOptions}>
                {['Remote', 'On-site', 'Hybrid'].map(option => (
                  <button key={option} style={styles.filterButton}>
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Job List Grid */}
          <div style={styles.jobGrid} ref={jobGridRef}>
            {displayedJobs.map((job, index) => (
              <div key={job._id} style={styles.jobCard}>
                <h4 style={styles.jobTitle}>{index + 1}</h4>
                <h4 style={styles.jobTitle}>{job.jobTitle}</h4>
                <p style={styles.jobDescription}>
                  {job.formattedCompensation?.payRange
                    ? `$${job.formattedCompensation.payRange.min} - $${job.formattedCompensation.payRange.max}`
                    : 'Salary range not provided'}
                </p>
                <p style={styles.jobDescription}>{job.jobLocation}</p>
                <p style={styles.jobDescription}>{job.locationFlexibility}</p>
                <p style={styles.jobDescription}>{job.jobLevel}</p>
                <a href={job.applyLink} target='_blank' rel='noopener noreferrer' style={styles.applyButton}>
                  <span style={styles.applyButtonText}>Apply</span>
                </a>
              </div>
            ))}
            {/* Show loading spinner only if there are more jobs to load */}
            {/* {loadingMore && displayedJobs.length < jobs.length && (
              <div style={styles.jobGridSpinner}>
                <LoadingSpinner />
              </div>
            )} */}
          </div>
        </>
      )}
    </div>
  );
};

export default FindJob;
