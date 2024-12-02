import { Triangle } from 'react-loader-spinner';

import useStyles from './LoadingScreenStyles';

type LoadingScreenProps = {
  backgroundColor?: string;
};

// this pages only purpose to to see if the user is logged in or not and redirect them to the right place
// it also does loadInitialData which goes and gets the users data from database, sets it in redux then navigates to correct place
const LoadingScreen = ({ backgroundColor }: LoadingScreenProps) => {
  const styles = useStyles(backgroundColor);

  return (
    <div style={styles.loadingScreenContainer}>
      <Triangle
        height="130"
        width="130"
        color="#4fa94d"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
};

export default LoadingScreen;
