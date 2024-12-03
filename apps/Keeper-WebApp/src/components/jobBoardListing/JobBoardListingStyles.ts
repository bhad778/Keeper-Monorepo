import { useTheme } from 'theme/theme.context';

export const useStyles = (jobColor: string, isJobMenuOpen: boolean, isAnimationHappening: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    jobListingTouchable: {
      height: 200,
      width: '100%',
      zIndex: 100,
      borderRadius: 27,
      marginBottom: 10,
      paddingTop: 2,
      paddingBottom: 20,
      paddingLeft: 25,
      paddingRight: 22,
      position: 'relative',
      backgroundColor: isAnimationHappening ? theme.color.darkGrey : jobColor,
      overflow: 'hidden',
    },
    newJobBackgroundAnimatedOverlay: {
      position: 'absolute',
      backgroundColor: jobColor,
      left: 0,
      height: '100%',
    },
    deleteJobBackgroundAnimatedOverlay: {
      position: 'absolute',
      backgroundColor: jobColor,
      left: 0,
      height: '100%',
    },
    ellipsisContainer: {
      position: 'absolute',
      top: 75,
      right: 15,
      zIndex: 999,
      cursor: 'pointer',
    },
    jobMenuAnimatedOverlay: {
      position: 'absolute',
      width: 200,
      height: '100%',
      zIndex: 999,
      right: 0,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    jobRightSideButtons: {
      fontSize: 32,
      zIndex: 1,
    },
    jobBoardListingButtonsText: {
      fontSize: 25,
      color: theme.color.primary,
      zIndex: 1,
    },
    ellipsis: {
      fontSize: 50,
      color: isJobMenuOpen ? theme.color.white : theme.color.primary,
    },
    jobListing: {
      height: '100%',
      justifyContent: 'center',
      paddingTop: 13,
      position: 'inherit',
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
    },
    jobListingBottom: {
      justifyContent: 'flex-start',
    },
    jobListingNumber: {
      fontSize: 16,
      color: theme.color.primary,
    },
    jobListingTitle: {
      fontSize: 40,
      flexShrink: 1,
      textTransform: 'capitalize',
      color: theme.color.primary,
    },
    jobListingCompanyName: {
      fontSize: 18,
      color: theme.color.primary,
      textTransform: 'uppercase',
    },
    redCircle: {
      width: 12,
      height: 12,
      backgroundColor: theme.color.alert,
      borderRadius: 50,
      position: 'absolute',
      right: 8,
      top: 8,
    },
    arrowSvg: {
      width: 12,
      height: 12,
    },
    xIconContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      cursor: 'pointer',
      zIndex: 9999,
    },
  } as const;

  return styles;
};

export default useStyles;
