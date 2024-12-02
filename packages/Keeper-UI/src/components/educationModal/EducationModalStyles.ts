import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modalStyles: {
      flex: 1,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'space-around',
      width: SCREEN_WIDTH,
      borderRadius: 0,
      left: -20,
    },
    headerTextContainer: {
      backgroundColor: theme.color.pink,
      width: '100%',
      height: 50,
      marginTop: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    welcomeToKeeperText: {
      textAlign: 'center',
      color: 'white',
      fontSize: 40,
    },
    tapOnCardsText: {
      fontSize: 20,
      color: theme.color.primary,
    },
    imageStyles: {
      position: 'relative',
      left: 20,
      // height: 314,
      // width: 300,
      height: SCREEN_HEIGHT * 0.3 + 12,
      width: SCREEN_HEIGHT * 0.3,
    },
    keeperDescriptionText: {
      textAlign: 'center',
    },
  });
  return styles;
};

export default useStyles;
