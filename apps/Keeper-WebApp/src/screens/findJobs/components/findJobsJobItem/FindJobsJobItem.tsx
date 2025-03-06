import React, { useState } from 'react';
import { AppText, KeeperImage } from 'components';
import { TJob } from 'keeperTypes';

import useStyles from './FindJobsJobItemStyles';

interface FindJobsJobItemProps {
  job: TJob;
  index: number;
  handleApplyClick: (job: TJob) => void;
}

const FindJobsJobItem: React.FC<FindJobsJobItemProps> = ({ job, index, handleApplyClick }) => {
  const styles = useStyles();
  const [isHovered, setIsHovered] = useState(false);

  // Format salary range for display
  const formatSalary = (job: TJob) => {
    if (!job.formattedCompensation?.payRange) return 'Salary not specified';

    const { min, max } = job.formattedCompensation.payRange;
    const type = job.formattedCompensation.type === 0 ? 'year' : 'hour';

    return `$${min.toLocaleString()} - $${max.toLocaleString()} per ${type}`;
  };

  // Get company logo or placeholder
  const getCompanyLogo = (job: TJob) => {
    if (job.companyId && job.companyId.logo) {
      return job.companyId.logo;
    }
    return job.companyLogo || '';
  };

  return (
    <div
      key={job._id || index}
      style={{
        ...styles.jobCard,
        ...(isHovered ? styles.jobCardHover : {}),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {job.companyLogo && (
          <div style={{ width: '50px', height: '50px', flexShrink: 0 }}>
            <KeeperImage
              source={getCompanyLogo(job)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              resizeMode='contain'
            />
          </div>
        )}
        <div>
          <AppText style={styles.jobTitle}>{job.jobTitle}</AppText>
          <AppText style={{ fontSize: '14px', color: '#cacaca' }}>
            {job.companyId?.companyName || job.companyName}
          </AppText>
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <AppText style={styles.jobDescription}>
          <strong>Location:</strong> {job.locationFlexibility || 'Not specified'}{' '}
          {job.jobLocation ? `- ${job.jobLocation}` : ''}
        </AppText>
        <AppText style={styles.jobDescription}>
          <strong>Experience:</strong> {job.requiredYearsOfExperience}+ years
        </AppText>
        <AppText style={styles.jobDescription}>
          <strong>Salary:</strong> {formatSalary(job)}
        </AppText>
      </div>

      <div style={{ marginTop: '10px' }}>
        <AppText style={styles.jobDescription}>
          <strong>Skills:</strong> {job.relevantSkills.slice(0, 5).join(', ')}
          {job.relevantSkills.length > 5 ? '...' : ''}
        </AppText>
      </div>

      <button
        style={{
          ...styles.applyButton,
          ...(isHovered ? styles.applyButtonHover : {}),
        }}
        onClick={() => handleApplyClick(job)}>
        Apply Now
      </button>
    </div>
  );
};

export default FindJobsJobItem;
