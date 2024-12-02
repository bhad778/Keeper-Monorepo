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

  const getEmployerBroswingData = useCallback(async () => {
    try {
      const employeesForSwipingPromise = UsersService.getEmployeesForSwiping({});
      const response = await Promise.all([employeesForSwipingPromise]);

      const employeesForSwiping = response[0];

      if (employeesForSwiping && employeesForSwiping.length > 0) {
        dispatch(setSwipingDataRedux(employeesForSwiping));
      }
    } catch (error) {
      console.error('There was an error getting swiping data new user: ' + error);
    }
  }, [dispatch]);

  // we reverse jobs because we reverse job on job board, because we want
  // the oldest jobs to be last and new ones to go to the top
  const returnReversedJobs = useCallback(() => {
    const tempEmployersJobs = employersJobs ? [...employersJobs] : [];
    return tempEmployersJobs.reverse();
  }, [employersJobs]);

  // not passing a selectedJob will use first job by default
  const setSelectedJob = useCallback(
    async (selectedJob?: TJob) => {
      if (employersJobs && employersJobs.length > 0) {
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
            .then((employeesForSwiping) => {
              dispatch(setSwipingDataRedux(employeesForSwiping));
              dispatch(setIsGetDataForSwipingLoading(false));
            })
            .catch((error) => {
              console.error('Error getEmployeesForSwiping after selecting job', error);
              dispatch(setIsGetDataForSwipingLoading(false));
            });
        }
      } else {
        getEmployerBroswingData();
      }
    },
    [dispatch, employersJobs, getEmployerBroswingData, returnReversedJobs]
  );

  const unselectJob = useCallback(async () => {
    dispatch(setSwipingDataRedux([]));
    dispatch(unselectJobRedux());
  }, [dispatch]);

  return {
    setSelectedJob,
    unselectJob,
  };
};

export default useEmployer;
