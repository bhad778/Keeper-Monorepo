import { TJob } from 'keeperTypes';

import useStyles from './FindJobsJobItemStyles';

type FindJobsJobItemProps = {
  job: TJob;
  index: number;
  handleApplyClick: (job: TJob) => void;
};

const FindJobsJobItem = ({ job, index, handleApplyClick }: FindJobsJobItemProps) => {
  const styles = useStyles();

  return (
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
      <span onClick={() => handleApplyClick(job)} style={styles.applyButton}>
        <span style={styles.buttonText}>Apply</span>
      </span>
    </div>
  );
};

export default FindJobsJobItem;
