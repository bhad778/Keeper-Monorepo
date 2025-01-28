import { useDispatch } from 'react-redux';
import { addLoggedInUser, resetLoggedInUserSlice } from 'reduxStore/LoggedInUserSlice/loggedInUserSlice';
import { resetDiscoverSlice, setSwipingDataRedux } from 'reduxStore/DiscoverSlice/discoverSlice';
import { resetLocalSlice } from 'reduxStore/LocalSlice/localSlice';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useCallback, useState } from 'react';
import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { useEmployer } from 'hooks';

import UsersService from './UsersService';

// functions in the file check if the current user is logged in on this browser,
// and then, gets the proper data from the DB if necessary and
// redirects to the correct screen.
const useAuth = () => {
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isEmployerNew = useSelector((state: RootState) => state.loggedInUser.isNew);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [isAuthLoading, setIsAuthLoading] = useState(false);

  const isEmployee = accountType === 'employee';
  const isNew = isEmployee ? isEmployeeNew : isEmployerNew;

  const { setSelectedJob } = useEmployer();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetReduxData = useCallback(() => {
    dispatch(resetDiscoverSlice());
    dispatch(resetLocalSlice());
    dispatch(resetLoggedInUserSlice());
  }, [dispatch]);

  const getUserData = async (accountType: string, phoneNumber: string) => {
    if (accountType === 'employer') {
      try {
        const response = await UsersService.getEmployerData({
          phoneNumber,
        });

        dispatch(addLoggedInUser(response.loggedInUserData));
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await UsersService.getEmployeeData({
          phoneNumber,
        });

        dispatch(addLoggedInUser(response.loggedInUserData));
        dispatch(setSwipingDataRedux(response.jobsForSwiping));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const loadInitialData = async () => {
    setIsAuthLoading(true);
    const checkDevicePromise = Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    try {
      const response = await Promise.all([checkDevicePromise]);
      // if the above checkDevicePromise() call does not throw an error, then the user is logged in
      await getUserData(response[0]?.attributes['custom:accountType'], response[0].attributes.phone_number);
      dispatch(addLoggedInUser({ isLoggedIn: true }));
      if (response[0]?.attributes['custom:accountType'] === 'employer') {
        setSelectedJob();
        navigate('/employerHome/discover');
      } else if (response[0]?.attributes['custom:accountType'] === 'employee') {
        if (isNew) {
          navigate('/employeeHome/profile');
        } else {
          navigate('/employeeHome/discover');
        }
      }
    } catch (error) {
      if (error === 'The user is not authenticated') {
        // if it errored because of the checkDevicePromise() call,
        // then user is not already logged in
        // setInitialScreen('AccountType');
        logOut();
      }
      // toast.error(genericErrorMessage);
      // console.error('Loading initial app data error', error);
    }
    setIsAuthLoading(false);
  };

  const resetReduxDataAndReload = () => {
    dispatch(resetDiscoverSlice());
    dispatch(resetLocalSlice());
    dispatch(resetLoggedInUserSlice());

    navigate('/');
  };

  const logOut = async () => {
    try {
      await Auth.signOut();
      resetReduxData();
      navigate('/browse/findJobs');
    } catch (error) {
      console.error('error signing out: ', error);
    }
  };

  return {
    isAuthLoading,
    resetReduxData,
    resetReduxDataAndReload,
    loadInitialData,
    getUserData,
    logOut,
  };
};

export default useAuth;
