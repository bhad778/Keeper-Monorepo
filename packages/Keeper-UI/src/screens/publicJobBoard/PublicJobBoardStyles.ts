import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const headerHeight = 100;

  const styles = StyleSheet.create({
    publicJobBoardContainer: {
      height: SCREEN_HEIGHT,
      paddingTop: 80,
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollview: {
      height: SCREEN_HEIGHT - headerHeight,
    },
    publicJobItem: {
      height: 120,
      borderBottomWidth: 1,
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    addJobButtonContainer: {
      justifyContent: 'center',
    },
    keeperButtonStyles: {
      backgroundColor: theme.color.primary,
      width: 100,
      height: 40,
    },
    keeperButtonText: {
      fontSize: 14,
    },
  });
  return styles;
};

export default useStyles;
