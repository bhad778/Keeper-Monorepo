import { Dimensions, Platform, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const windowWidth = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const containerHeight = 70;

  const styles = StyleSheet.create({
    container: {
      height: containerHeight,
      paddingBottom: Platform.OS === 'ios' ? 0 : 30,
      borderBottomWidth: 2,
      borderBottomColor: theme.color.white,
      width: '100%',
      borderColor: theme.color.white,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: windowWidth < 400 ? 35 : 40,
      fontFamily: 'app-page-title-font',
      lineHeight: 60,
      color: theme.color.white,
    },
    browseTopText: {
      textAlign: 'center',
      fontSize: 16,
      color: theme.color.alert,
    },
    jobBoardHeader: {
      height: 100,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    headerLeftSection: {
      height: '100%',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerMiddleSection: {
      height: '100%',
      width: '60%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRightSection: {
      height: '100%',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    jobBoardHeaderText: {
      fontSize: 50,
      color: theme.color.white,
    },
    rightContentsText: {
      color: 'white',
      fontSize: 16,
    },
    rightTouchable: {
      paddingTop: 4,
    },
  });

  return styles;
};

export default useStyles;
