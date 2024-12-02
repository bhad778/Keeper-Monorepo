import { useTheme } from 'theme/theme.context';

export const useStyles = (isCandidateSort: boolean) => {
  const { theme } = useTheme();

  const selectedSortFontSize = 24;
  const unSelectedSortFontSize = 17;

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      paddingTop: 2,
      width: '100%',
    },
    matchesContainer: {
      display: 'flex',
      // height: '100vh',
    },
    tabText: {
      fontSize: 24,
    },
    matchesSection: {
      backgroundColor: theme.color.primary,
      flexDirection: 'row',
      // minHeight: '90vh',
      overflow: 'scroll',
      height: '100%',
      paddingTop: 30,
      width: '100%',
    },
    messagesSection: {
      backgroundColor: theme.color.primary,
      position: 'absolute',
      height: '100vh',
      top: -6,
      right: 0,
      width: 280,
      maxWidth: 'none',
    },
    emptyJobPlaceholder: {
      width: '100%',
      marginBottom: 20,
      borderRadius: 30,
      backgroundColor: theme.color.primary,
      height: 140,
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 13,
      paddingRight: 13,
    },
    sortContainer: {
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    },
    jobText: {
      fontSize: isCandidateSort ? unSelectedSortFontSize : selectedSortFontSize,
      color: 'white',
    },
    hitSlop: {
      top: 70,
      right: 70,
      bottom: 30,
    },
    sortText: {
      fontSize: 15,
      position: 'relative',
      left: -10,
      color: 'white',
    },
    slashCharacter: {
      fontSize: 18,
      color: 'white',
      paddingTop: 4,
      marginLeft: 10,
      marginRight: 10,
    },
    candidateText: {
      fontSize: isCandidateSort ? selectedSortFontSize : unSelectedSortFontSize,
      color: 'white',
    },
    scrollView: {
      width: '100%',
      flexGrow: 1,
    },
    contentInset: {
      top: 0,
      bottom: 250,
    },
    jobBoardHeader: {
      marginTop: 30,
      height: 120,
      borderBottomWidth: 2,
      borderBottomColor: theme.color.white,
      width: '100%',
      borderColor: theme.color.white,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    jobBoardHeaderText: {
      fontSize: 55,
      color: theme.color.white,
    },
    matchButton: {
      height: 70,
      backgroundColor: 'white',
      paddingLeft: 10,
      paddingRight: 10,
    },
    matchTextContainer: {
      height: '100%',
      width: '68%',
    },
    avatarImageContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: '100%',
    },
    images: {
      marginRight: 20,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
      paddingTop: 22,
      paddingBottom: 3,
    },
    newMessage: {
      alignSelf: 'flex-end',
      marginTop: 10,
    },
    notificationButtonContainer: {
      flexDirection: 'row',
      marginBottom: 5,
      justifyContent: 'space-between',
      width: '100%',
    },
    notificationButton: {
      width: '50%',
      fontSize: 10,
      borderRadius: 20,
    },
    nameInfo: {
      fontWeight: '400',
      fontSize: 14,
      width: '95%',
    },
    noMatchesTextContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      paddingBottom: 40,
    },
    text: {
      color: theme.color.white,
      textAlign: 'center',
      width: '76%',
      fontSize: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
