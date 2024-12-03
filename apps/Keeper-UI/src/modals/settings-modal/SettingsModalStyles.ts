import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    settingsModalContainer: {
      backgroundColor: theme.color.keeperGrey,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 20,
      paddingBottom: 13,
      borderBottomWidth: 2,
      borderColor: theme.color.primary,
    },
    arrowIcon: {
      color: theme.color.white,
      width: 13,
      height: 13,
      paddingRight: 20,
    },
    helpCenterRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingBottom: 10,
    },
    keeperProButton: {
      height: 60,
      marginTop: 10,
      borderWidth: 2,
      borderColor: theme.color.primary,
      borderRadius: 100,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    keeperProButtonText: {
      textAlign: 'center',
      color: theme.color.primary,
      fontSize: 20,
    },
    text: {
      color: theme.color.primary,
    },
  });

  return styles;
};

export default useStyles;
