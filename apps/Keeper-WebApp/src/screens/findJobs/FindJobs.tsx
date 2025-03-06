import { useEffect, useRef } from 'react';
import { AlertModal, FindJobsJobItem, LoadingSpinner } from 'components';

import useStyles from './FindJobsStyles';
import { useJobFilters } from './hooks/useJobFilters';
import { useJobData } from './hooks/useJobData';
import FilterSidebar from './components/filterSidebar/FilterSidebar';

const PRELOAD_OFFSET = 2000;

const FindJob = () => {
  const { filters, isLocationVisible, handleSearchChange, toggleFilter, handleCityChange, handleSalaryChange } =
    useJobFilters();

  const {
    jobs,
    displayedJobs,
    loading,
    loadingMore,
    loadMoreJobs,
    handleApplyClick,
    isNotLoggedInAlertOpen,
    setIsNotLoggedInAlertOpen,
  } = useJobData(filters);

  const jobGridRef = useRef<HTMLDivElement | null>(null);

  const styles = useStyles();

  // Handle scrolling and load more functionality
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

      {/* Sidebar with filters */}
      <FilterSidebar
        filters={filters}
        isLocationVisible={!!isLocationVisible}
        handleSearchChange={handleSearchChange}
        toggleFilter={toggleFilter}
        handleCityChange={handleCityChange}
        handleSalaryChange={handleSalaryChange}
      />

      {/* Job listings area */}
      <div style={styles.jobGridContainer}>
        {loading ? (
          <div style={styles.fullPageSpinner}>
            <LoadingSpinner />
          </div>
        ) : (
          <div style={styles.jobGrid} ref={jobGridRef}>
            {displayedJobs.map((job, index) => (
              <FindJobsJobItem key={job._id || index} job={job} index={index} handleApplyClick={handleApplyClick} />
            ))}
            {loadingMore && (
              <div style={styles.jobGridSpinner}>
                <LoadingSpinner size='80' />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJob;
