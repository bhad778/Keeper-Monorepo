import { useTheme } from 'theme/theme.context';

export const useStyles = (isEmployee: boolean, selectedJobColor?: string) => {
  const { theme } = useTheme();

  const browseModeSectionHeight = 100;

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme.color.primary,
      position: 'relative',
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
    },
    animationSvg: {
      height: 300,
      width: 300,
    },
    backButton: {
      width: '12%',
      position: 'absolute',
      top: 50,
      left: 50,
    },
    browseModeTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      borderBottom: '1px solid grey',
      height: browseModeSectionHeight,
      position: 'relative',
      zIndex: 1,
      backgroundColor: theme.color.primary,
      textDecoration: 'none',
    },
    employeeHeaderContainer: {
      backgroundColor: theme.color.primary,
    },
    cantSwipeModal: {
      padding: 32,
    },
    cantSwipeText: {
      fontSize: 26,
    },
    limitedAccessTitle: {
      color: theme.color.alert,
    },
    limitedAccessSubtitle: {
      color: theme.color.alert,
    },
    noMoreLeftContainer: {
      paddingLeft: 20,
      paddingRight: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    emptyHeader: {
      backgroundColor: selectedJobColor,
    },
    noMoreLeftText: {
      marginTop: 50,
      fontSize: 40,
      color: theme.color.white,
      textAlign: 'center',
      width: '70%',
    },
    selectAccountTypeButton: {
      top: 140,
      width: undefined,
    },
    addBasicInfoSection: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    addBasicInfoContainer: {
      justifyContent: 'center',
      marginTop: 100,
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      height: 20,
      width: 20,
    },
    headerTitle: {
      color: !selectedJobColor ? theme.color.white : 'black',
    },
    likeDislikeIcon: {
      position: 'fixed',
      top: '50%',
      left: '48%',
      zIndex: 1,
      color: 'white',
      opacity: 0,
      visibility: 'hidden',
    },
    keeperLogoAnimationIcon: {
      position: 'fixed',
      top: '50%',
      left: '48%',
      zIndex: 1,
      opacity: 0,
      visibility: 'hidden',
    },
  } as const;

  return styles;
};

export default useStyles;
