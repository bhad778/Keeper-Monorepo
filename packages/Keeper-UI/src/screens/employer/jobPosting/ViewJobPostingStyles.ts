import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    jobPostingContainer: {
      backgroundColor: theme.color.primary,
      minHeight: SCREEN_HEIGHT,
    },
    loadingContainer: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
    },
    text: {
      color: theme.color.white,
    },
    backButton: {
      position: 'absolute',
      top: 55,
      left: 20,
    },
    modalHeader: {
      borderBottomWidth: 0,
      backgroundColor: theme.color.primary,
      marginTop: Platform.OS === 'ios' ? 40 : -10,
    },
  });
  return styles;
};

export default useStyles;
