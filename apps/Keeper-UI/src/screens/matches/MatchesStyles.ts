import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isCandidateSort: boolean, matchesLength: number) => {
  const { theme } = useTheme();

  const selectedSortFontSize = 19;
  const unSelectedSortFontSize = 13;

  const styles = StyleSheet.create({
    matchesSection: {
      flex: 1,
      backgroundColor: theme.color.primary,
      marginBottom: 20,
    },
    matchesContainer: {
      paddingTop: matchesLength > 0 ? 30 : 0,
    },
    candidatesChannelListWrapper: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollViewContainer: {
      flexGrow: 1,
      width: '100%',
    },
    emptyJobPlaceholder: {
      width: '100%',
      marginBottom: 20,
      borderRadius: 30,
      backgroundColor: theme.color.darkGrey,
      height: 140,
      paddingVertical: 10,
      paddingHorizontal: 13,
    },
    sortContainer: {
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
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
      position: 'absolute',
      left: 0,
      color: 'white',
    },
    slashCharacter: {
      fontSize: 13,
      color: 'white',
      paddingTop: 5,
    },
    candidateText: {
      fontSize: isCandidateSort ? selectedSortFontSize : unSelectedSortFontSize,
      color: 'white',
      paddingTop: !isCandidateSort ? 3.5 : 0,
    },
    scrollView: {
      width: '100%',
      flexGrow: 1,
      paddingRight: 15,
      paddingLeft: 15,
      paddingBottom: Platform.OS === 'ios' ? 0 : 300,
    },
    contentInset: {
      top: 0,
      bottom: 250,
    },
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
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
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      marginTop: 20,
      paddingBottom: 40,
    },
    text: {
      color: theme.color.white,
      textAlign: 'center',
      fontSize: 20,
    },
    tabBar: {
      backgroundColor: theme.color.primary,
      height: 110,
      color: 'blue',
      borderColor: 'blue',
    },
    tabIndicator: {
      backgroundColor: theme.color.pink,
    },
    tabText: {
      color: theme.color.pink,
      fontSize: 23,
      marginTop: 45,
    },
  });
  return styles;
};

export default useStyles;
