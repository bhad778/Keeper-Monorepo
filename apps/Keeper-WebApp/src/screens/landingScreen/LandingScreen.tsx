import { useAuth } from 'services';
import { useEffect } from 'react';
// @ts-ignore
import { Triangle } from 'react-loader-spinner';

import useStyles from './LandingScreenStyles';

// this pages only purpose to to see if the user is logged in or not and redirect them to the right place
// it also does loadInitialData which goes and gets the users data from database, sets it in redux then navigates to correct place
const LandingScreen = () => {
  const styles = useStyles();
  const { isAuthLoading, loadInitialData } = useAuth();
  // const { isAuthLoading, loadInitialData, logOut } = useAuth();

  useEffect(() => {
    // logOut();

    // this will redirect to the correct place based on if theyre logged in or not
    loadInitialData();
  }, []);

  if (isAuthLoading) {
    return (
      <div style={styles.landingScreenContainer}>
        <Triangle
          height='130'
          width='130'
          color='#4fa94d'
          ariaLabel='triangle-loading'
          wrapperStyle={{}}
          visible={true}
        />
      </div>
    );
  }

  return <></>;
};

export default LandingScreen;
