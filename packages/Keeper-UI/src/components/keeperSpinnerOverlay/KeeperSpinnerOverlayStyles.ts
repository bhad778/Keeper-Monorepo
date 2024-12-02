import { StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const styles = StyleSheet.create({
    spinnerContainer: {
      position: 'absolute',
      left: SCREEN_WIDTH / 2 - 20,
      top: SCREEN_HEIGHT / 2 - 20,
      backgroundColor: 'red',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 99999,
    },
    spinner: {
      position: 'absolute',
      top: SCREEN_HEIGHT / 2 - 13,
      left: SCREEN_WIDTH / 2 - 17,
      zIndex: 1,
    },
  });

  return styles;
};

export default useStyles;
