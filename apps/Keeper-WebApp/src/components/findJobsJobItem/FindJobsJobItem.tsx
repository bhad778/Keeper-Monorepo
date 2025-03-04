import { TJob } from 'keeperTypes';

import useStyles from './FindJobsJobItemStyles';

type FindJobsJobItemProps = {
  job: TJob;
  index: number;
};

const FindJobsJobItem = ({ job, index }: FindJobsJobItemProps) => {
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
      <a href={job.applyLink} target='_blank' rel='noopener noreferrer' style={styles.applyButton}>
        <span style={styles.buttonText}>Apply</span>
      </a>
    </div>
  );
};

export default FindJobsJobItem;
