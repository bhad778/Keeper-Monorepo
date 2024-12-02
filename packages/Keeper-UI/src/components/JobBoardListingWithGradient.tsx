import React, { useState, useEffect, useCallback, memo } from 'react';

import JobBoardListing from './jobBoardListing/JobBoardListing';
import { LinearGradient } from 'expo-linear-gradient';

const JobBoardListingWithGradient = ({
  jobMenusOpen,
  jobLoadingProgress,
  onJobListingPress,
  onPreviewJobPress,
  onDeleteJobPress,
  job,
  isNewJob,
}) => {
  const gradientColors = ['grey', job?.color];

  return (
    <LinearGradient
      locations={[0.01, 0.01]}
      colors={gradientColors}
      start={{ x: 1 - jobLoadingProgress, y: 1 }}
      style={{ borderRadius: 27, marginBottom: 10 }}
      end={{ x: 0, y: 1 }}>
      <JobBoardListing
        jobMenusOpen={jobMenusOpen}
        onJobListingPress={onJobListingPress}
        onPreviewJobPress={onPreviewJobPress}
        onDeleteJobPress={onDeleteJobPress}
        job={job}
        isNewJob={isNewJob}
      />
    </LinearGradient>
  );
};

export default JobBoardListingWithGradient;
