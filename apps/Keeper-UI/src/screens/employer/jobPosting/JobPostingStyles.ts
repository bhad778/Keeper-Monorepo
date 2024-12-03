import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (bottomNavBarHeight: number, isEmployeeNew: boolean) => {
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
      paddingHorizontal: 10,
      flexDirection: 'row',
    },
    browseNextButton: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOpacity: 1,
      elevation: 6,
      shadowRadius: 30,
      shadowOffset: { width: 1, height: 13 },
      width: 110,
      height: 55,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 100,
      backgroundColor: theme.color.pink,
      flexDirection: 'row',
      paddingHorizontal: 15,
    },
    browseNextText: {
      color: theme.color.black,
      fontSize: 19,
    },
    jobPostingContainer: {
      backgroundColor: theme.color.primary,
      minHeight: SCREEN_HEIGHT,
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
      lineHeight: 25,
      paddingTop: 5,
      color: theme.color.primary,
    },
    jobPosting: {
      // paddingTop: 10,
    },
    titleStyles: {
      lineHeight: 50,
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    dislikeButton: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
    },
  });
  return styles;
};

export default useStyles;
