import { EditEmployee } from 'components';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import { PhoneNumber, NameAndCompany } from 'screens';

const EmployeeProfileScreen = () => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const hasGottenToEditProfileScreen = useSelector(
    (state: RootState) => state.loggedInUser.hasGottenToEditProfileScreen
  );

  const returnCurrentScreen = () => {
    if (!isLoggedIn) {
      return <PhoneNumber />;
    } else {
      if (hasGottenToEditProfileScreen) {
        return <EditEmployee editEmployeeData={{ employeeSettings, _id: loggedInUserId }} />;
      } else {
        return <NameAndCompany />;
      }
    }
  };

  return returnCurrentScreen();
};

export default EmployeeProfileScreen;
