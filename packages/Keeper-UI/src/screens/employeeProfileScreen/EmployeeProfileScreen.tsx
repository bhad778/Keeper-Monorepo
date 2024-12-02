import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { EditEmployee } from 'components';
import { ViewResume, PhoneNumber, NameAndCompany } from 'screens';

const EmployeeProfileScreen = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const hasGottenToEditProfileScreen = useSelector(
    (state: RootState) => state.loggedInUser.hasGottenToEditProfileScreen,
  );
  const isNewEmployee = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);

  const returnCurrentScreen = () => {
    if (!isLoggedIn) {
      return <PhoneNumber />;
    } else if (isNewEmployee) {
      if (hasGottenToEditProfileScreen) {
        return <EditEmployee editEmployeeData={{ employeeSettings, _id: loggedInUserId }} />;
      } else {
        return <NameAndCompany />;
      }
    } else if (!isNewEmployee) {
      return <ViewResume />;
    }
  };

  return returnCurrentScreen();
};

export default EmployeeProfileScreen;
