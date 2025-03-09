import { TJob } from 'keeperTypes';

import useStyles from './FindJobsJobItemStyles';
import span from 'components/span';

type FindJobsJobItemProps = {
  job: TJob;
  index: number;
  handleApplyClick: (job: TJob) => void;
};

const FindJobsJobItem = ({ job, index, handleApplyClick }: FindJobsJobItemProps) => {
  const styles = useStyles();

  return (
    <div key={job._id} style={styles.jobCard}>
      <span style={styles.jobTitle}>{index + 1}</span>
      <span style={styles.title}>jobTitle</span>
      <span style={styles.jobTitle}>{job.jobTitle}</span>
      <span style={styles.title}>jobLocation</span>
      <span style={styles.jobTitle}>{job.jobLocation}</span>
      <span style={styles.title}>locationFlexibility</span>
      <span style={styles.jobTitle}>{job.locationFlexibility}</span>
      <span style={styles.title}>seniorityLevel</span>
      <span style={styles.jobTitle}>{job.seniorityLevel}</span>
      <span style={styles.title}>skills</span>
      <span style={styles.jobTitle}>{JSON.stringify(job.relevantSkills)}</span>
      <span style={styles.title}>minSalary</span>
      <span style={styles.jobTitle}>{job.formattedCompensation?.payRange?.min}</span>
      <span style={styles.title}>maxSalary</span>
      <span style={styles.jobTitle}>{job.formattedCompensation?.payRange?.max}</span>
      <p style={styles.jobDescription}>
        {job.formattedCompensation?.payRange
          ? `$${job.formattedCompensation.payRange.min} - $${job.formattedCompensation.payRange.max}`
          : 'Salary range not provided'}
      </p>
      <p style={styles.jobDescription}>{job.jobLocation}</p>
      <p style={styles.jobDescription}>{job.locationFlexibility}</p>
      <p style={styles.jobDescription}>{job.seniorityLevel}</p>
      <span onClick={() => handleApplyClick(job)} style={styles.applyButton}>
        <span style={styles.buttonText}>Apply</span>
      </span>
    </div>
  );
};

export default FindJobsJobItem;
