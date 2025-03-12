import { CSSProperties } from 'react';
// @ts-ignore
import { Triangle } from 'react-loader-spinner';

type LoadingSpinnerProps = {
  size?: string;
  styles?: CSSProperties;
};

// this pages only purpose to to see if the user is logged in or not and redirect them to the right place
// it also does loadInitialData which goes and gets the users data from database, sets it in redux then navigates to correct place
const LoadingSpinner = ({ size = '130', styles }: LoadingSpinnerProps) => {
  return (
    <div style={styles}>
      <Triangle
        height={size}
        width={size}
        color='#4fa94d'
        ariaLabel='triangle-loading'
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
};

export default LoadingSpinner;
