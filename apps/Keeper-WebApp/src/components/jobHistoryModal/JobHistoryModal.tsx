import { useCallback, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { AppText, Clickable, KeeperSelectButton, PastJobItem, JobHistoryItem } from 'components';
import { TEmployeePastJob } from 'keeperTypes';
import { useReorderJobHistory } from 'hooks';
import { Checkbox } from '@mui/material';

import { useStyles } from './JobHistoryModalStyles';

type JobHistoryModalProps = {
  jobHistory: TEmployeePastJob[];
  setJobHistory: (jobHistory: TEmployeePastJob[]) => void;
  isSeekingFirstJob: boolean | undefined;
  setIsSeekingFirstJob: (newValue: boolean) => void;
  hasCheckBeenPressed: boolean;
  shouldTextBeWhite?: boolean;
  hasUploadedResume: boolean;
  uncompletedFieldsArray: string[];
};

const JobHistoryModal = ({
  jobHistory,
  setJobHistory,
  isSeekingFirstJob,
  setIsSeekingFirstJob,
  shouldTextBeWhite,
  hasCheckBeenPressed,
  hasUploadedResume,
}: JobHistoryModalProps) => {
  const [currentJobHistoryItem, setCurrentJobHistoryItem] = useState<TEmployeePastJob | null>(null);

  const styles = useStyles();
  const { reorderedJobHistory } = useReorderJobHistory(jobHistory);

  const onIsSeekingFirstJobPress = useCallback(
    (newValue: boolean) => {
      setIsSeekingFirstJob(newValue);
    },
    [setIsSeekingFirstJob],
  );

  const addJobHistoryItem = () => {
    setCurrentJobHistoryItem({
      uuid: uuidv4(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      jobDescription: '',
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <JobHistoryItem
        jobHistoryItem={currentJobHistoryItem}
        jobHistory={jobHistory}
        setJobHistory={setJobHistory}
        currentJobHistoryItem={currentJobHistoryItem}
        setCurrentJobHistoryItem={setCurrentJobHistoryItem}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
      />

      <div style={styles.contents}>
        <Clickable style={styles.checkboxContainer} onClick={() => onIsSeekingFirstJobPress(!isSeekingFirstJob)}>
          <>
            <AppText style={styles.areYouLooking}>Don't have any past software dev jobs?</AppText>
            <Checkbox style={styles.checkBox} checked={isSeekingFirstJob} />
          </>
        </Clickable>

        <div style={styles.scrollView}>
          <>
            {reorderedJobHistory &&
              reorderedJobHistory.map((pastJob: TEmployeePastJob, index: number) => (
                <PastJobItem
                  job={pastJob}
                  jobHistoryLength={jobHistory.length}
                  index={index}
                  hasCheckBeenPressed={hasCheckBeenPressed}
                  shouldTextBeWhite={shouldTextBeWhite}
                  hasUploadedResume={hasUploadedResume}
                  key={index}
                  onClick={() => {
                    setCurrentJobHistoryItem(pastJob);
                  }}
                  isWhite
                  isEditProfileScreen={true}
                  isJobHistoryScreen={true}
                />
              ))}
          </>
          <div style={styles.addJobButtonContainer}>
            <KeeperSelectButton
              onClick={addJobHistoryItem}
              title='Add a Job'
              buttonStyles={styles.addItemButton}
              textStyles={styles.addItemButtonText}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobHistoryModal;
