import { useState } from 'react';
import { TJob } from 'keeperTypes';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import { KeeperSelectButton } from 'components';
import toast from 'react-hot-toast';
import { downloadBlob, tailorResumeForJob } from 'utils';

import useStyles from './FindJobsJobItemStyles';

type FindJobsJobItemProps = {
  job: TJob;
  index: number;
  setIsVisible: (visible: boolean) => void;
  handleApplyClick: (job: TJob) => void;
};

const FindJobsJobItem = ({ job, index, setIsVisible, handleApplyClick }: FindJobsJobItemProps) => {
  const [isTailoring, setIsTailoring] = useState(false);
  const employeeId = useSelector((state: RootState) => state.loggedInUser._id);
  const hasResume = useSelector((state: RootState) => state.loggedInUser.hasResume);

  const styles = useStyles();

  const tailorResume = async () => {
    try {
      setIsTailoring(true);

      // Tailor the resume and get the result as a blob
      const tailoredResumeBlob = await tailorResumeForJob(employeeId as string, job);

      // Download the tailored resume
      const filename = `resume_${job.companyName.replace(/\s+/g, '_')}.pdf`;
      downloadBlob(tailoredResumeBlob, filename);

      toast.success('Tailored resume added to downloads');
    } catch (error) {
      console.error('Error tailoring resume:', error);
      toast.error('Failed to tailor resume. Please try again.');
    } finally {
      setIsTailoring(false);
    }
  };

  const onTailorButtonClick = () => {
    if (hasResume) {
      tailorResume();
    } else {
      setIsVisible(true);
    }
  };

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
        onClick={onTailorButtonClick}
        title='Tailor Resume With AI'
        isLoading={isTailoring}
        disabled={isTailoring}
        buttonStyles={styles.applyButton}
        textStyles={styles.buttonText}
      />
    </div>
  );
};

export default FindJobsJobItem;
