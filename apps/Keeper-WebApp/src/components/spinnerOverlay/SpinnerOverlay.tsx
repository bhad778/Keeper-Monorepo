import { LoadingSpinner } from 'components';
import useStyles from './SpinnerOverlayStyles';

const SpinnerOverlay = () => {
  const styles = useStyles();

  return (
    <div style={styles.spinnerOverlay}>
      <LoadingSpinner />
    </div>
  );
};

export default SpinnerOverlay;
