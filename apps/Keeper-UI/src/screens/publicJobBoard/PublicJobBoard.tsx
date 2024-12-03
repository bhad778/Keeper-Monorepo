import { TouchableOpacity, View, ScrollView } from 'react-native';
import { JobsService } from 'services';
import React, { useEffect, useState } from 'react';
import { AppHeaderText, AppText, BackButton, KeeperSelectButton, KeeperSpinnerOverlay } from 'components';
import { TJob } from 'keeperTypes';
import { ViewJobPosting } from 'screens';
import { PreviewJobModal } from 'modals';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addEmployersJobs, deleteJobRedux } from 'reduxStore';
import Toast from 'react-native-toast-message';

import useStyles from './PublicJobBoardStyles';

const PublicJobBoard = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser.phoneNumber);

  const [publicJobs, setPublicJobs] = useState<TJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<TJob>();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateJobLoading, setIsUpdateJobLoading] = useState<string>('');

  const styles = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    const grabJobs = async () => {
      setIsLoading(true);
      const getJobsForSwiping = await JobsService.getJobsForSwiping({ isPublic: true });
      setPublicJobs(getJobsForSwiping);
      setIsLoading(false);
    };
    grabJobs();
  }, []);

  const updatePublicTakers = (jobId: string, isAdd: boolean) => {
    const updatedPublicJobs: TJob[] = [];
    publicJobs.map(publicJob => {
      const tempPublicJob = { ...publicJob };
      if (publicJob._id === jobId) {
        if (isAdd) {
          const tempPublicTakers = [...tempPublicJob.publicTakers, loggedInUserId];
          tempPublicJob.publicTakers = tempPublicTakers;
        } else {
          tempPublicJob.publicTakers = publicJob.publicTakers.filter(el => {
            return el != loggedInUserId;
          });
        }
      }
      updatedPublicJobs.push(tempPublicJob);
    });
    setPublicJobs(updatedPublicJobs);
  };

  const onUpdateJob = (job: TJob, isAdd: boolean) => {
    setIsUpdateJobLoading(job._id || '');
    let publicTakers = [...job.publicTakers];
    if (isAdd) {
      publicTakers.push(loggedInUserId);
    } else {
      publicTakers = publicTakers.filter(el => {
        return el != loggedInUserId;
      });
    }
    JobsService.updateJobData({
      jobId: job._id || '',
      updateObject: { publicTakers },
    })
      .then(() => {
        if (isAdd) {
          dispatch(addEmployersJobs(job));
        } else {
          dispatch(deleteJobRedux({ jobId: job._id || '' }));
        }
        updatePublicTakers(job._id || '', isAdd);
        Toast.show({
          type: 'success',
          text1: `Job ${isAdd ? 'Added' : 'Removed'}`,
          position: 'bottom',
          visibilityTime: 500,
        });
        setIsUpdateJobLoading('');
      })
      .catch(error => {
        console.error('Error adding job: ' + error);
        Toast.show({
          type: 'error',
          text1: 'Error adding job, try again later: ' + error,
          position: 'bottom',
          visibilityTime: 500,
        });
        setIsUpdateJobLoading('');
      });
  };

  return (
    <View style={styles.publicJobBoardContainer}>
      <BackButton />
      <KeeperSpinnerOverlay isLoading={isLoading} />

      <PreviewJobModal isViewJobPostingModalVisible={!!selectedJob}>
        <ViewJobPosting previewJobData={selectedJob} closeJobPreviewModal={() => setSelectedJob(undefined)} noEdit />
      </PreviewJobModal>
      <View style={styles.header}>
        <AppHeaderText>Public Job Board</AppHeaderText>
      </View>
      <ScrollView style={styles.scrollview}>
        {publicJobs.map((publicJob, index) => (
          <TouchableOpacity style={styles.publicJobItem} onPress={() => setSelectedJob(publicJob)} key={index}>
            <View style={styles.textContainer}>
              <AppText>Title: {publicJob.settings.title}</AppText>
              <AppText>Company: {publicJob.settings.companyName}</AppText>
              <AppText>Refferal Bonus: {publicJob.settings.referralBonus}</AppText>
              <AppText>Owner: {publicJob.ownerId == loggedInUserId ? 'You' : publicJob.ownerName}</AppText>
              <AppText>Current Takers: {publicJob.publicTakers.length}</AppText>
            </View>
            <View style={styles.addJobButtonContainer}>
              {publicJob.ownerId != loggedInUserId && (
                <KeeperSelectButton
                  buttonStyles={styles.keeperButtonStyles}
                  textStyles={styles.keeperButtonText}
                  onPress={() => onUpdateJob(publicJob, !publicJob.publicTakers.includes(loggedInUserId))}
                  isLoading={isUpdateJobLoading == publicJob._id}
                  title={publicJob.publicTakers.includes(loggedInUserId) ? 'Remove Job' : 'Take Job'}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default PublicJobBoard;
