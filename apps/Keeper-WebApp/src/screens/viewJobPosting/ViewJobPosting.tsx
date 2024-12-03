/* eslint-disable no-undef */
import { useEffect, useState } from 'react';
import { BackButton, JobPostingComponent } from 'components';
import { TJobSettings } from 'keeperTypes';
import { LoadingScreen } from 'screens';
import { JobsService } from 'services';
import { useParams } from 'react-router-dom';

import { useStyles } from './ViewJobPostingStyles';

const ViewJobPosting = () => {
  const { id } = useParams();

  // previewJobData will be filled if coming from addJob
  const [selectedJobSettings, setSelectedJobSettings] = useState<TJobSettings | null>();

  const styles = useStyles();

  useEffect(() => {
    // this all only happens if coming from deep link, this uses ID from deep link to get the job data
    const getData = async () => {
      try {
        const jobData = await JobsService.getJobById({ jobId: id || '' });
        if (jobData.error && jobData.error == 'Account deleted error') {
          // alert('This job no longer exists!', 'Press ok to go back.', [
          //   {
          //     text: 'OK',
          //     onClick: () => {
          //       navigation.goBack();
          //     },
          //   },
          // ]);
        } else {
          setSelectedJobSettings(jobData.settings);
        }
      } catch (error) {
        // Alert.alert('There was an error!', 'Press ok to go back.', [
        //   {
        //     text: 'OK',
        //     onClick: () => {
        //       navigation.goBack();
        //     },
        //   },
        // ]);
      }
    };
    if (id) {
      getData();
    }
  }, []);

  if (!selectedJobSettings) {
    return <LoadingScreen />;
  }

  return (
    <div style={styles.jobPostingContainer}>
      <BackButton iconStyles={styles.backButtonIcon} />
      <div>
        <JobPostingComponent currentJobSettings={selectedJobSettings} isOwner={true} />
      </div>
    </div>
  );
};

export default ViewJobPosting;
