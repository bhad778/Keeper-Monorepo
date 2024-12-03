import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    educationTypeContainer: {
      flex: 5,
      padding: 20,
    },
    section: {
      marginBottom: 19,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    threeButton: {
      width: '33%',
      height: 45,
    },
  });

  return styles;
};

export default useStyles;
