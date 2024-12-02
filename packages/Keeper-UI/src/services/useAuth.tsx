import { useDispatch } from 'react-redux';
import {
  addLoggedInUser,
  resetDiscoverSlice,
  resetLocalSlice,
  resetLoggedInUserSlice,
  setSwipingDataRedux,
} from 'reduxStore';
import { Auth } from 'aws-amplify';
import { useCallback } from 'react';

import UsersService from './UsersService';

const useAuth = () => {
  const dispatch = useDispatch();

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

  const resetReduxData = useCallback(() => {
    dispatch(resetDiscoverSlice());
    dispatch(resetLocalSlice());
    dispatch(resetLoggedInUserSlice());
  }, [dispatch]);

  const logOut = async () => {
    try {
      await Auth.signOut();
    } catch (error) {
      console.error('error signing out: ', error);
    }
  };
  return {
    getUserData,
    logOut,
    resetReduxData,
  };
};

export default useAuth;
