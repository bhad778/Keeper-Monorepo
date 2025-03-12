import { TJob } from 'keeperTypes';

import useStyles from './FindJobsJobItemStyles';
import { KeeperSelectButton } from 'components';

type FindJobsJobItemProps = {
  job: TJob;
  index: number;
  setIsVisible: (visible: boolean) => void;
  handleApplyClick: (job: TJob) => void;
};

const FindJobsJobItem = ({ job, index, setIsVisible, handleApplyClick }: FindJobsJobItemProps) => {
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
      <KeeperSelectButton
        onClick={() => handleApplyClick(job)}
        title='Apply'
        buttonStyles={styles.applyButton}
        textStyles={styles.buttonText}
      />
      <KeeperSelectButton
        onClick={() => setIsVisible(true)}
        title='Tailor Resume for this Job'
        buttonStyles={styles.applyButton}
        textStyles={styles.buttonText}
      />
    </div>
  );
};

export default FindJobsJobItem;
