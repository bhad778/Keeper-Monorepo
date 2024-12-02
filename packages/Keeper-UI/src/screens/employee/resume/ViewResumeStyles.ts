import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: SCREEN_WIDTH,
      overflow: 'hidden',
      backgroundColor: 'red',
    },
    viewResumeContainer: {
      backgroundColor: theme.color.primary,
      justifyContent: 'center',
      alignItems: 'center',
      width: SCREEN_WIDTH,
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    scrollView: {
      width: SCREEN_WIDTH,
    },
    text: {
      color: theme.color.primary,
    },
    submitText: {
      color: theme.color.white,
      fontSize: 14,
      right: 3,
    },

    header: {
      zIndex: 101,
      paddingLeft: 15,
      paddingRight: 15,
      width: '100%',
    },
    headerPill: {
      backgroundColor: theme.color.white,
      width: '100%',
      height: 72,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      zIndex: 101,
      marginTop: 50,
      borderWidth: theme.general.borderWidth,
      marginBottom: 20,
    },
    leftSection: {
      height: '100%',
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightSection: {
      height: '100%',
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleSection: {
      height: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 6,
    },
    titleText: {
      fontSize: 20,
    },
    loadingContainer: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      color: 'white',
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
    },
  });
  return styles;
};

export default useStyles;
