import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';
import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (bottomNavBarHeight: number, isEmployerNew: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    xOrNextButtonContainer: {
      height: bottomNavBarHeight == -1 ? 0 : bottomTabNavigatorBaseHeight,
      width: bottomNavBarHeight == -1 ? 0 : '100%',
      position: 'absolute',
      bottom: bottomNavBarHeight + 10,
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 15,
      flexDirection: 'row',
    },
    likeDislikeButton: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOpacity: 1,
      elevation: 6,
      shadowRadius: 30,
      shadowOffset: { width: 1, height: 13 },
      width: 110,
      height: 55,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 100,
      backgroundColor: theme.color.pink,
      flexDirection: 'row',
      paddingHorizontal: 15,
    },
    browseNextText: {
      color: theme.color.black,
      fontSize: 19,
    },
    name: {
      fontSize: 40,
      paddingTop: 10,
    },
    headerTitle: {
      color: theme.color.white,
      fontSize: 33,
    },
    hideBottomNavScrollView: {
      zIndex: 1,
      paddingBottom: 500,
    },
    resume: {
      paddingTop: 0,
    },
    body: {
      height: '100%',
      zIndex: 100,
    },
    jobHistoryTitle: {
      fontSize: 40,
      marginBottom: 10,
    },
    jobTitle: {
      fontSize: 20,
      fontWeight: '500',
    },
    container: {
      backgroundColor: theme.color.primary,
      zIndex: 1,
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
      lineHeight: 25,
      paddingTop: 5,
      color: theme.color.primary,
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
    },
    redesignHeader: {
      borderBottomWidth: 0,
      backgroundColor: theme.color.primary,
    },
  });
  return styles;
};

export default useStyles;
