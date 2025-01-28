// FindJob.tsx
import { useEffect, useState } from 'react';
import { TGetJobsForSwipingPayload } from 'keeperServices';
import { JobsService } from 'services';
import { LoadingSpinner } from 'components';
import { TJob } from 'keeperTypes';

import useStyles from './FindJobsStyles';

const defaultPayload: TGetJobsForSwipingPayload = {
  userId: '6789b086457faa1335ce57d8',
  textSearch: 'react',
};

const FindJob = () => {
  const [jobs, setJobs] = useState<TJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const styles = useStyles();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await JobsService.getJobsForSwiping(defaultPayload);
        setJobs(response || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div style={styles.container}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {/* Sidebar with Search and Filters */}
          <div style={styles.sidebar}>
            <input type='text' placeholder='Search jobs...' style={styles.searchBar} />

            {/* Job Level Filter */}
            <div style={styles.filterGroup}>
              <h3 style={styles.filterTitle}>Job Level</h3>
              <div style={styles.filterOptions}>
                {['Entry', 'Intern', 'Mid', 'Senior'].map(level => (
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
          <div style={styles.jobGrid}>
            {jobs.map(job => (
              <div key={job._id} style={styles.jobCard}>
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
          </div>
        </>
      )}
    </div>
  );
};

export default FindJob;
