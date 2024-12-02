/* eslint-disable no-undef */
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View, ScrollView } from 'react-native';
import { JobPostingComponent, AppBoldText, RedesignModalHeader, KeeperSpinnerOverlay, BackButton } from 'components';
import { TJob, TJobSettings } from 'types';
import { AddJob } from 'screens';
import { useNavigation, useRoute } from '@react-navigation/native';
import { JobsService } from 'services';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';

import { useStyles } from './ViewJobPostingStyles';

type ViewJobPostingProps = {
  closeJobPreviewModal?: () => void;
  previewJobData?: TJob;
  noEdit?: boolean;
  isJobComplete?: boolean;
  postJob?: () => void;
};

const ViewJobPosting = ({
  previewJobData,
  closeJobPreviewModal,
  noEdit,
  isJobComplete,
  postJob,
}: ViewJobPostingProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const route = useRoute();
  const navigation = useNavigation();

  // this will be filled if coming from deep link or other place in app
  // where we do not have full job data so must pass id to get rest from backend
  const otherJobId = route?.params?.otherJobId;

  // this is for instances where were navigating here and we do have
  // full job data so can skip hitting database
  const job = route?.params?.job;

  // previewJobData will be filled if coming from addJob
  const [selectedJob, setSelectedJob] = useState<TJob | null>(previewJobData || job || null);
  const [isEditJobModalOpen, setIsEditJobModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isEmployee = accountType === 'employee';

  const styles = useStyles();

  useEffect(() => {
    // this all only happens if coming from deep link, this uses ID from deep link to get the job data
    const getData = async () => {
      try {
        setIsLoading(true);
        const jobData = await JobsService.getJobById({ jobId: otherJobId || '' });
        if (jobData.error && jobData.error == 'Account deleted error') {
          Alert.alert('This job no longer exists!', 'Press ok to go back.', [
            {
              text: 'OK',
              onPress: () => {
                navigation.goBack();
              },
            },
          ]);
        } else {
          setSelectedJob(jobData);
        }
      } catch (error) {
        Alert.alert('There was an error!', 'Press ok to go back.', [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      }
      setIsLoading(false);
    };
    if (otherJobId) {
      getData();
    }
  }, []);

  const updateJobLocal = (updatedJobSettings: TJobSettings) => {
    setSelectedJob(prevState => {
      return { ...prevState, settings: updatedJobSettings };
    });
  };

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const closeAddJobModal = useCallback(() => {
    setIsEditJobModalOpen(false);
  }, []);

  return (
    <>
      {isEditJobModalOpen && selectedJob && (
        <AddJob
          addJobModalVisible={isEditJobModalOpen}
          setAddJobModalVisible={setIsEditJobModalOpen}
          jobColor={selectedJob.color}
          editJobData={{ jobSettings: selectedJob.settings, _id: selectedJob._id }}
          updateJobLocal={updateJobLocal}
          closeAddJobModal={closeAddJobModal}
        />
      )}

      <View style={styles.jobPostingContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {otherJobId && <BackButton touchableContainerStyles={styles.backButton} isBlack />}

          {!otherJobId && (
            <RedesignModalHeader
              title='YOUR JOB'
              goBackAction={closeJobPreviewModal ? closeJobPreviewModal : goBack}
              containerStyles={styles.modalHeader}>
              {!noEdit && (
                <TouchableOpacity
                  onPress={() => setIsEditJobModalOpen(true)}
                  hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                  <AppBoldText style={styles.text}>Edit</AppBoldText>
                </TouchableOpacity>
              )}
              {isJobComplete && (
                <TouchableOpacity onPress={postJob} hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                  <AppBoldText style={styles.text}>Submit</AppBoldText>
                </TouchableOpacity>
              )}
            </RedesignModalHeader>
          )}

          <View>
            {selectedJob ? (
              <JobPostingComponent currentJobSettings={selectedJob.settings} isOwner={true} />
            ) : (
              <View style={styles.loadingContainer}>
                <KeeperSpinnerOverlay isLoading={isLoading} />
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ViewJobPosting;
