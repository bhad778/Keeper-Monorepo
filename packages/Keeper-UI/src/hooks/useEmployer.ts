import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setIsGetDataForSwipingLoading,
  setSwipingDataRedux,
  setSelectedJob as setSelectedJobRedux,
  RootState,
  unselectJobRedux,
} from 'reduxStore';
import { UsersService } from 'services';
import { TJob } from 'types';

const useEmployer = () => {
  const employersJobs = useSelector((state: RootState) => state.loggedInUser.employersJobs);

  const dispatch = useDispatch();

  // we reverse jobs because we reverse job on job board, because we want
  // the oldest jobs to be last and new ones to go to the top
  const returnReversedJobs = useCallback(() => {
    const tempEmployersJobs = employersJobs ? [...employersJobs] : [];
    return tempEmployersJobs.reverse();
  }, [employersJobs]);

  const getBrowsingData = useCallback(async () => {
    dispatch(setSwipingDataRedux([]));
    dispatch(setIsGetDataForSwipingLoading(true));
    const employeesForSwiping = await UsersService.getEmployeesForSwiping({});
    dispatch(setSwipingDataRedux(employeesForSwiping));
    dispatch(setIsGetDataForSwipingLoading(false));
  }, [dispatch]);

  // not passing a selectedJob will use first job by default
  const setSelectedJob = useCallback(
    async (selectedJob?: TJob) => {
      const reversedJobs = returnReversedJobs();
      const firstJobInStack = employersJobs ? reversedJobs[0] : undefined;

      const localSelectedJob = selectedJob || firstJobInStack;

      if (localSelectedJob) {
        dispatch(setSwipingDataRedux([]));
        dispatch(setIsGetDataForSwipingLoading(true));
        dispatch(setSelectedJobRedux(localSelectedJob));

        UsersService.getEmployeesForSwiping({
          jobId: localSelectedJob._id,
          preferences: localSelectedJob.preferences,
        })
          .then(employeesForSwiping => {
            dispatch(setSwipingDataRedux(employeesForSwiping));
            dispatch(setIsGetDataForSwipingLoading(false));
          })
          .catch(error => {
            console.error('Error getEmployeesForSwiping after selecting job', error);
            dispatch(setIsGetDataForSwipingLoading(false));
          });
      }
    },
    [dispatch, employersJobs, returnReversedJobs],
  );

  const unselectJob = useCallback(async () => {
    getBrowsingData();
    dispatch(unselectJobRedux());
  }, [dispatch, getBrowsingData]);

  return {
    setSelectedJob,
    unselectJob,
  };
};

export default useEmployer;
