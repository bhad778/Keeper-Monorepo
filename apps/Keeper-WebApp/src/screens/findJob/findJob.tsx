// FindJob.tsx
import React from 'react';

import useStyles from './findJobStyles';

const FindJob: React.FC = () => {
  const styles = useStyles();

  return (
    <div style={styles.container}>
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
        {[...Array(10)].map((_, index) => (
          <div key={index} style={styles.jobCard}>
            <h4 style={styles.jobTitle}>Job Title {index + 1}</h4>
            <p style={styles.jobDescription}>A brief description of the job...</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindJob;
