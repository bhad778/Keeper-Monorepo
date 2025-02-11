import { useEffect, useState, useCallback, useRef } from 'react';
import { TGetJobsForSwipingPayload, JobsService } from 'keeperServices';
import { LoadingSpinner } from 'components';
import { JobLevel, TJob } from 'keeperTypes';
import { TechnologiesList } from 'keeperConstants';

import useStyles from './FindJobsStyles';

const defaultPayload: TGetJobsForSwipingPayload = {
  userId: '6789b086457faa1335ce57d8',
  textSearch: '',
  preferences: {
    jobLevel: [],
    locationFlexibility: [],
    relevantSkills: [],
  },
};

const ITEMS_PER_PAGE = 30;
const PRELOAD_OFFSET = 2000;
const SEARCH_DEBOUNCE_DELAY = 1000;

const FindJob = () => {
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [filters, setFilters] = useState<TGetJobsForSwipingPayload>(defaultPayload);

  const loadingMoreRef = useRef(false);
  const jobGridRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const styles = useStyles();

  const fetchJobs = async (updatedFilters: TGetJobsForSwipingPayload) => {
    try {
      setLoading(true);
      const response = await JobsService.getJobsForSwiping(updatedFilters);
      setJobs(response.data || []);
      setDisplayedJobs((response.data || []).slice(0, ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs when filters change
  useEffect(() => {
    if (jobGridRef.current) {
      jobGridRef.current.scrollTo({ top: 0 });
    }
    fetchJobs(filters);
  }, [filters]);

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

  // Debounced search
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setFilters(prevFilters => ({
        ...prevFilters,
        textSearch: value,
      }));
    }, SEARCH_DEBOUNCE_DELAY);
  };

  // Handle toggling filters (jobLevel, locationFlexibility, relevantSkills)
  const toggleFilter = (key: 'jobLevel' | 'locationFlexibility' | 'relevantSkills', value: string) => {
    setFilters(prevFilters => {
      const currentValues = prevFilters.preferences?.[key] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return {
        ...prevFilters,
        preferences: {
          ...prevFilters.preferences,
          [key]: newValues,
        },
      };
    });
  };

  return (
    <div style={styles.container}>
      <>
        {/* Sidebar with Search and Filters */}
        <div style={styles.sidebar}>
          <input
            type='text'
            placeholder='Senior react developer...'
            style={styles.searchBar}
            onChange={handleSearchChange}
          />

          {/* Job Level Filter */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Seniority Level</h3>
            <div style={styles.filterOptions}>
              {Object.values(JobLevel).map(level => (
                <button
                  key={level}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: filters.preferences?.jobLevel?.includes(level)
                      ? styles.filterButtonSelected.backgroundColor
                      : styles.filterButton.backgroundColor,
                  }}
                  onClick={() => toggleFilter('jobLevel', level)}>
                  <span style={styles.buttonText}>{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Flexibility Filter */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Location Flexibility</h3>
            <div style={styles.filterOptions}>
              {['Remote', 'On-site', 'Hybrid'].map(option => (
                <button
                  key={option}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: filters.preferences?.locationFlexibility?.includes(option)
                      ? styles.filterButtonSelected.backgroundColor
                      : styles.filterButton.backgroundColor,
                  }}
                  onClick={() => toggleFilter('locationFlexibility', option)}>
                  <span style={styles.buttonText}>{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Skills Filter */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Skills</h3>
            <div style={styles.skillOptions}>
              {TechnologiesList.map((skill: string) => (
                <button
                  key={skill}
                  style={{
                    ...styles.skillButton,
                    backgroundColor: filters.preferences?.relevantSkills?.includes(skill)
                      ? styles.filterButtonSelected.backgroundColor
                      : styles.skillButton.backgroundColor,
                  }}
                  onClick={() => toggleFilter('relevantSkills', skill)}>
                  <span style={styles.buttonText}>{skill}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={styles.jobGridContainer}>
          {loading ? (
            <div style={styles.fullPageSpinner}>
              <LoadingSpinner />
            </div>
          ) : (
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
                    <span style={styles.buttonText}>Apply</span>
                  </a>
                </div>
              ))}
            </div>
          )}
          {/* {loadingMore && displayedJobs.length < jobs.length && (
            <div style={styles.jobGridSpinner}>
              <LoadingSpinner />
            </div>
          )} */}
        </div>
      </>
    </div>
  );
};

export default FindJob;
