import { useEffect, useState, useCallback, useRef } from 'react';
import { TGetJobsForSwipingPayload, JobsService, ApplicationsService } from 'keeperServices';
import { AlertModal, FindJobsJobItem, KeeperSlider, LoadingSpinner } from 'components';
import { SeniorityLevelEnum, TJob } from 'keeperTypes';
import { cities, TechnologiesList } from 'keeperConstants';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, setEmployeePreferencesRedux } from 'reduxStore';
import { useTheme } from 'theme/theme.context';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

import useStyles from './FindJobsStyles';

const ITEMS_PER_PAGE = 30;
const PRELOAD_OFFSET = 2000;
const SEARCH_DEBOUNCE_DELAY = 1000;

const FindJob = () => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);
  const textSearch = useSelector((state: RootState) => state.loggedInUser.preferences.textSearch);
  const seniorityLevel = useSelector((state: RootState) => state.loggedInUser.preferences.seniorityLevel);
  const minimumSalary = useSelector((state: RootState) => state.loggedInUser.preferences.minimumSalary);
  const locationFlexibility = useSelector((state: RootState) => state.loggedInUser.preferences.locationFlexibility);
  const city = useSelector((state: RootState) => state.loggedInUser.preferences.city);
  const relevantSkills = useSelector((state: RootState) => state.loggedInUser.preferences.relevantSkills);

  const defaultPayload: TGetJobsForSwipingPayload = {
    userId: employeeId,
    preferences: {
      seniorityLevel,
      minimumSalary,
      locationFlexibility,
      city,
      relevantSkills,
    },
  };

  const [jobs, setJobs] = useState<TJob[]>([]);
  const [displayedJobs, setDisplayedJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNotLoggedInAlertOpen, setIsNotLoggedInAlertOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState<TGetJobsForSwipingPayload>(defaultPayload);

  const { theme } = useTheme();
  const loadingMoreRef = useRef(false);
  const jobGridRef = useRef<HTMLDivElement | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const filtersUpdatedRef = useRef(false);
  const dispatch = useDispatch();

  const styles = useStyles();

  const isLocationVisible =
    filters.preferences?.locationFlexibility?.includes('Hybrid') ||
    filters.preferences?.locationFlexibility?.includes('On-site');

  // Fetch jobs when filters change
  useEffect(() => {
    if (jobGridRef.current) {
      jobGridRef.current.scrollTo({ top: 0 });
    }
    if (filtersUpdatedRef.current && isLoggedIn) {
      dispatch(
        setEmployeePreferencesRedux({
          ...filters.preferences,
        }),
      );
      filtersUpdatedRef.current = false;
    }
    fetchJobs(filters);
  }, [filters]);

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

  // Handle toggling filters (seniorityLevel, locationFlexibility, relevantSkills)
  const toggleFilter = (key: 'seniorityLevel' | 'locationFlexibility' | 'relevantSkills', value: string) => {
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

  const handleApplyClick = (job: TJob) => {
    if (isLoggedIn) {
      ApplicationsService.addApplication({ jobId: job._id || '', employeeId: employeeId || '' });
      window.open(job.applyLink, '_blank', 'noopener,noreferrer');
    } else {
      setIsNotLoggedInAlertOpen(true);
    }
  };

  // Handle city change
  const handleCityChange = (event: any) => {
    const city = event.target.value;

    setFilters(prevFilters => ({
      ...prevFilters,
      preferences: {
        ...prevFilters.preferences,
        city,
      },
    }));

    filtersUpdatedRef.current = true;
  };

  // Handle minimum salary change
  const handleSalaryChange = (value: number) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      preferences: {
        ...prevFilters.preferences,
        minimumSalary: value,
      },
    }));

    filtersUpdatedRef.current = true;
  };

  return (
    <div style={styles.container}>
      <AlertModal
        isOpen={isNotLoggedInAlertOpen}
        title={'You have to be signed up to apply'}
        subTitle={
          'Sign up by just inputting email and confirming phone to make sure your not AI to get back to applying!'
        }
        closeModal={() => setIsNotLoggedInAlertOpen(false)}
        onConfirmPress={() => {}}
        confirmText={'Sign Up'}
      />
      <>
        {/* Sidebar with Search and Filters */}
        <div style={styles.sidebar}>
          <h3 style={styles.filterTitle}>Title</h3>
          <input
            type='text'
            placeholder='Senior react developer...'
            style={styles.searchBar}
            value={textSearch}
            onChange={handleSearchChange}
          />

          {/* Job Level Filter */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Seniority Level</h3>
            <div style={styles.filterOptions}>
              {Object.values(SeniorityLevelEnum).map(level => (
                <button
                  key={level}
                  style={{
                    ...styles.filterButton,
                    backgroundColor: filters.preferences?.seniorityLevel?.includes(level)
                      ? styles.filterButtonSelected.backgroundColor
                      : styles.filterButton.backgroundColor,
                  }}
                  onClick={() => toggleFilter('seniorityLevel', level)}>
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

          {/* City Location Dropdown */}
          {isLocationVisible && (
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>City</h3>
              <FormControl
                fullWidth
                sx={{
                  mt: 1,
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: () => (isLocationVisible ? 'rgba(255, 255, 255, 0.1)' : theme.color.keeperGrey),
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: () => (isLocationVisible ? 'rgba(255, 255, 255, 0.3)' : 'white'),
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.6,
                  },
                }}>
                <InputLabel id='city-select-label' sx={{ color: 'white' }}>
                  City
                </InputLabel>
                <Select
                  labelId='city-select-label'
                  id='city-select'
                  value={filters.preferences?.city || ''}
                  label='City'
                  onChange={handleCityChange}
                  sx={{
                    color: 'white',
                    '& .MuiSelect-icon': { color: 'white' },
                  }}>
                  <MenuItem value=''>
                    <em>Select a city</em>
                  </MenuItem>
                  {cities.map(city => (
                    <MenuItem key={city} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}

          {/* Salary Filter */}
          <div style={styles.filterGroup}>
            <h3 style={styles.filterTitle}>Minimum Salary</h3>
            <div style={styles.filterOptions}>
              <KeeperSlider
                minimumValue={30000}
                maximumValue={300000}
                step={5000}
                defaultValue={filters.preferences?.minimumSalary as number}
                formatDisplayValue={value => `$${value.toLocaleString()}`}
                onSliderComplete={handleSalaryChange}
              />
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
                <FindJobsJobItem job={job} index={index} handleApplyClick={handleApplyClick} />
              ))}
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default FindJob;
