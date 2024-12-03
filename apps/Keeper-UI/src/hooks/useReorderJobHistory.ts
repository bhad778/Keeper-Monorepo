import { useEffect, useState } from 'react';
import { TEmployeePastJob } from 'keeperTypes';
import { transformYearToString } from 'projectUtils';

// this holds the logic for counting how much of the form the user has left to complete
// that shows in the right side of the header, like on the editEmployee screen
const useReorderJobHistory = (jobHistory: TEmployeePastJob[] | undefined) => {
  const [reorderedJobHistory, setReorderedJobHistory] = useState(jobHistory);

  useEffect(() => {
    reorderJobs(jobHistory);
  }, [jobHistory]);

  const reorderJobs = async (jobHistory: TEmployeePastJob[]) => {
    let reorderedJobs = [...jobHistory];
    if (reorderedJobs) {
      reorderedJobs = reorderedJobs.sort((a: TEmployeePastJob, b: TEmployeePastJob) => {
        const firstDateMonth = a.startDate.split('/')[0];
        const firstDateYear = transformYearToString(a.startDate.split('/')[1]);
        const secondDateMonth = b.startDate.split('/')[0];
        const secondDateYear = transformYearToString(b.startDate.split('/')[1]);

        const firstDate = Number(firstDateYear + firstDateMonth);
        const secondDate = Number(secondDateYear + secondDateMonth);

        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        const end = secondDate - firstDate;

        return end;
      });
    }

    setReorderedJobHistory(reorderedJobs);
  };

  return {
    reorderedJobHistory,
  };
};

export default useReorderJobHistory;
