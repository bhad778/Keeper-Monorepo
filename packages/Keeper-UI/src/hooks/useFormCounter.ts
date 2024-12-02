import { useCallback, useEffect, useState } from 'react';
import { TEmployeeEducation, TEmployeePastJob } from 'types';
import { useTheme } from 'theme/theme.context';
import { isEducationHistoryItemComplete, isPastJobComplete } from 'utils';

// this holds the logic for counting how much of the form the user has left to complete
// that shows in the right side of the header, like on the editEmployee screen
const useFormCounter = (
  formState: any,
  hasCheckBeenPressed: boolean,
  isEmployee?: boolean,
  hasUploadedResume?: boolean,
) => {
  const { theme } = useTheme();

  const [totalCompletedFields, setTotalCompletedFields] = useState(0);
  const [uncompletedFieldsArray, setUncompletedFieldsArray] = useState<string[]>([]);

  const returnErrorStyles = useCallback(
    (field: string) => {
      if (
        (hasCheckBeenPressed && uncompletedFieldsArray.includes(field)) ||
        (field === 'educationHistory' && hasUploadedResume && uncompletedFieldsArray.includes(field))
      ) {
        return {
          color: theme.color.alert,
        };
      }
    },
    [hasCheckBeenPressed, hasUploadedResume, theme.color.alert, uncompletedFieldsArray],
  );

  useEffect(() => {
    updateTotalCompletedFields();
  }, [formState]);

  const isObjectFieldCompleted = (object: any) => {
    const totalFieldsLength = Object.keys(object).length;
    let totalCompletedFields = 0;
    Object.values(object).forEach(item => {
      if (item) {
        totalCompletedFields++;
      }
    });
    if (totalCompletedFields === totalFieldsLength) {
      return 'completed';
    } else if (totalCompletedFields > 0) {
      return 'partially completed';
    } else {
      return 'not completed';
    }
  };

  // could be educationHistory or jobHistory
  const isArrayOfObjectsFieldCompleted = (jobHistory: TEmployeePastJob[] | TEmployeeEducation[] | undefined) => {
    if (!jobHistory) {
      return jobHistory;
    }

    const totalJobsLength = Object.keys(jobHistory).length;
    let totalCompletedJobs = 0;
    let totalPartialJobs = 0;

    jobHistory.forEach(pastJob => {
      const isObjectFinishedString = isObjectFieldCompleted(pastJob);

      if (isObjectFinishedString == 'completed') {
        totalCompletedJobs++;
      } else if (isObjectFinishedString == 'partially completed') {
        totalPartialJobs++;
      }
    });

    // any truthy value other than 'exclamation' returned would make it a checkmark,
    // any falsy value will make it a caret symbol
    if (totalJobsLength === totalCompletedJobs) {
      return true;
    } else if (totalPartialJobs > 0) {
      return 'exclamation';
    } else {
      return false;
    }
  };

  const isJobHistoryIncomplete = useCallback((jobHistory: TEmployeePastJob[]) => {
    let isOnePastJobIncomplete = false;

    jobHistory.forEach((pastJob: TEmployeePastJob) => {
      if (!isPastJobComplete(pastJob, true)) {
        isOnePastJobIncomplete = true;
      }
    });
    return isOnePastJobIncomplete;
  }, []);

  const isEducationHistoryIncomplete = useCallback((educationHistory: TEmployeeEducation[]) => {
    let isOneEducationItemIncomplete = false;

    if (educationHistory.length === 0) {
      return true;
    }

    educationHistory.forEach((educationItem: TEmployeeEducation) => {
      if (!isEducationHistoryItemComplete(educationItem)) {
        isOneEducationItemIncomplete = true;
      }
    });
    return isOneEducationItemIncomplete;
  }, []);

  const updateTotalCompletedFields = () => {
    const tempFormState = { ...formState };
    if (tempFormState) {
      delete tempFormState.uuid;
      delete tempFormState.id;
      delete tempFormState._id;
    }

    let finishedFieldCount = 0;
    const uncompletedFields: string[] = [];

    // if its an array of objects, then it needs to check if every field inside of it is completed
    Object.entries(tempFormState).map(([key, value]) => {
      if (key === 'jobHistory') {
        // if they have not filled in job history or isSeekingFirstJob at all, show general jobHistory error
        if (!formState?.jobHistory?.length && !formState?.isSeekingFirstJob) {
          uncompletedFields.push('jobHistory');
        } else if (
          // if they have a job history, and one of the items is incomplete then trigger general jobHistory error
          isJobHistoryIncomplete(formState?.jobHistory || []) &&
          formState?.jobHistory != null &&
          !!formState?.jobHistory?.length
        ) {
          uncompletedFields.push('jobHistory');
        } else {
          finishedFieldCount++;
        }
      } else if (
        key === 'educationHistory' &&
        !isEducationHistoryIncomplete(formState?.educationHistory || []) &&
        formState?.educationHistory != null
      ) {
        finishedFieldCount++;
      } else if (
        value &&
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === 'object' &&
        isArrayOfObjectsFieldCompleted(value) &&
        isArrayOfObjectsFieldCompleted(value) != 'exclamation' &&
        key != 'jobHistory'
      ) {
        finishedFieldCount++;
      } else if (Array.isArray(value) && value.length > 0 && typeof value[0] != 'object') {
        // check if non empty array that is not an array of objects
        finishedFieldCount++;
        // check if non empty object
      } else if (typeof value === 'object' && !Array.isArray(value) && value != null && Object.keys(value).length > 0) {
        finishedFieldCount++;
        // any number will work
      } else if ((key === 'startDate' || key === 'endDate') && value != '' && typeof value == 'string') {
        const dateArray = value?.split('-');
        // make sure whole date is filled out
        if (dateArray[0] != '0000' && dateArray[1] != '00') {
          finishedFieldCount++;
        }
      } else if (typeof value === 'number') {
        finishedFieldCount++;
        // special check for compensation
      } else if (key === 'degree' && value != 'Enter Degree' && value != 'None' && value != '') {
        finishedFieldCount++;
      } else if (typeof value === 'string' && value != '') {
        finishedFieldCount++;
      } else if (typeof value === 'boolean') {
        finishedFieldCount++;
      } else if (
        // these are not fields they actually fill in themselves
        key != 'isSeekingFirstJob' &&
        key != 'referralBonus' &&
        key != 'isPublic' &&
        key != 'nonJobRelatedSkills'
      ) {
        uncompletedFields.push(key);
      }
    });

    setTotalCompletedFields(finishedFieldCount);
    setUncompletedFieldsArray(uncompletedFields);
  };

  return {
    totalCompletedFields,
    uncompletedFieldsArray,
    returnErrorStyles,
    isArrayOfObjectsFieldCompleted,
    isObjectFieldCompleted,
  };
};

export default useFormCounter;
