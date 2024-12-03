import { RouterProvider } from 'react-router-dom';
import router from 'router';
import KeeperLogo from 'assets/images/keeperLogo.png';
import useStyles from 'AppStyles';
import { useMediaQuery, useTheme } from '@mui/material';
import { Header, KeeperSelectButton } from 'components';
import { useEffect } from 'react';
import { UsersService } from 'services';
import { Auth } from 'aws-amplify';
import { addLoggedInUser, setSwipingDataRedux } from 'reduxStore';
import { useDispatch } from 'react-redux';

// App component
function App() {
  const styles = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
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

  useEffect(() => {
    const updateData = async () => {
      try {
        const response = await Auth.currentAuthenticatedUser({
          bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        });
        getUserData(response?.attributes['custom:accountType'], response.attributes.phone_number);
      } catch (error) {
        console.error('there was an error updatingData in useEffect in App.tsx', error);
      }
    };

    updateData();
  }, []);

  const redirectToAppleStore = () => {
    window.location.href = 'https://apps.apple.com/us/app/keeper-find-software-jobs/id6448758803';
  };
  const redirectToGoogleStore = () => {
    window.location.href = 'https://play.google.com/store/apps/details?id=com.bhad778.keeperApp';
  };
  // Provide the router configuration using RouterProvider
  return (
    <div style={styles.appContainer}>
      {isSmallScreen ? (
        <div
          style={{
            padding: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={KeeperLogo} style={{ width: '20%', marginBottom: 20 }} />

          <Header textInputLabelStyle={{ textAlign: 'center' }} text="Download The App To View On Mobile" />
          <KeeperSelectButton
            onClick={redirectToAppleStore}
            title="Get IOS"
            buttonStyles={{ padding: 10, width: '40%' }}
          />
          <KeeperSelectButton
            onClick={redirectToGoogleStore}
            title="Get ANDROID"
            buttonStyles={{ padding: 10, width: '40%' }}
          />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
    </div>
  );
}

export default App;
