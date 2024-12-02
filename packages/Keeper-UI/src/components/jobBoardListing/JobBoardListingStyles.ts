import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (titleLength: number, opacityAnimValue: any, isDeleting: boolean) => {
  const { theme } = useTheme();

  const jobListingHeight = 180;

  const styles = StyleSheet.create({
    jobListingTouchable: {
      height: jobListingHeight,
      width: SCREEN_WIDTH * 0.93,
      zIndex: 100,
      borderRadius: 27,
      paddingBottom: 24,
      marginBottom: !isDeleting ? 10 : 0,
      paddingLeft: 25,
      paddingRight: 22,
    },
    ellipsis: {
      position: 'absolute',
      top: 75,
      right: 8,
      zIndex: 1,
    },
    jobListingMenuAnimatedView: {
      height: jobListingHeight,
      width: SCREEN_WIDTH * 0.93,
      borderRadius: 27,
      position: 'absolute',
      zIndex: 1,
      backgroundColor: theme.color.darkGrey,
      opacity: opacityAnimValue,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    jobMenuButtonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '87%',
      rowGap: 3,
      columnGap: 3,
      flexWrap: 'wrap',
    },
    jobMenuButton: {
      width: '45%',
      height: 47,
      backgroundColor: theme.color.darkGrey,
    },
    jobListing: {
      height: '100%',
      justifyContent: 'center',
      paddingTop: 13,
    },
    jobListingTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    jobListingMiddle: {
      minHeight: 95,
      justifyContent: 'center',
      flexShrink: 1,
      paddingRight: 20,
    },
    jobListingBottom: {
      justifyContent: 'flex-start',
    },
    jobListingNumber: {
      fontSize: 16,
      color: theme.color.primary,
    },
    xCircle: {
      borderRadius: 99,
      height: 25,
      width: 25,
      backgroundColor: theme.color.primary,
      borderColor: theme.color.white,
      borderWidth: 2,
      borderStyle: 'solid',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 15,
      top: 15,
    },
    blackCircle: {
      borderRadius: 99,
      height: 25,
      width: 25,
      backgroundColor: theme.color.primary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      right: 15,
      top: 15,
    },
    arrowSvg: {
      width: 10,
      height: 10,
    },
    jobListingTitle: {
      fontSize: titleLength > 20 ? 33 : 40,
      flexShrink: 1,
      lineHeight: 44,
      textTransform: 'capitalize',
      color: theme.color.primary,
    },
    jobListingCompanyName: {
      fontSize: 18,
      lineHeight: 20,
      textTransform: 'capitalize',
      color: theme.color.primary,
    },
    redCircle: {
      width: 12,
      height: 12,
      backgroundColor: 'red',
      borderRadius: 50,
      position: 'absolute',
      right: 8,
      top: 8,
    },
  });

  return styles;
};

export default useStyles;
