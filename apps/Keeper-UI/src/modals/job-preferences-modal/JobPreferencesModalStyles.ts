import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    preferenceModalContainer: {
      paddingLeft: 15,
      paddingRight: 15,
    },
    header: {
      zIndex: 101,
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
      fontSize: 15,
    },
    preferenceItem: {
      minHeight: 60,
      borderBottomWidth: 1,
      borderBottomColor: theme.color.black,
    },
    openItemIcon: {
      position: 'absolute',
      right: 0,
      top: 10,
    },
    spinner: {
      position: 'absolute',
      top: SCREEN_HEIGHT / 3,
      left: SCREEN_WIDTH / 2 - 10,
      zIndex: 1,
    },
  });

  return styles;
};

export default useStyles;
