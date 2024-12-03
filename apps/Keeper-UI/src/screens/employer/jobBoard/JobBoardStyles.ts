import { StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (fadeAnim: Animated.Value) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    jobBoardModal: {
      zIndex: 100,
      height: '100%',
    },
    jobListingTouchable: {
      height: 180,
      width: SCREEN_WIDTH * 0.93,
      zIndex: 100,
      borderRadius: 27,
      paddingBottom: 24,
      paddingLeft: 25,
      paddingRight: 22,
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      zIndex: 100,
      backgroundColor: theme.color.primary,
      height: '100%',
    },
    addJobTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 40,
      marginBottom: 15,
    },
    plusIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    addNewJobText: {
      color: theme.color.text,
      fontSize: 20,
      paddingLeft: 4,
      paddingTop: 4,
    },
    jobListingNumberSection: {
      height: '100%',
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    jobListingNumberText: {
      fontSize: 22,
    },
    jobListingTextSection: {
      height: '100%',
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    jobListingText: {
      fontSize: 20,
    },
    jobListingSubText: {
      fontSize: 14,
    },
    jobListingRightSection: {
      width: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    jobTitleContainer: {
      width: '100%',
      marginTop: 20,
    },
    createNewJobButton: {
      height: 70,
      width: SCREEN_WIDTH,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'row',
      backgroundColor: '#1e1e1e',
    },
    appText: {
      color: '#cacaca',
    },
    createJobTextContainer: {
      color: theme.color.white,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: SCREEN_WIDTH * 0.7,
      position: 'absolute',
      bottom: 160,
    },
    createJobText: {
      color: theme.color.white,
      fontSize: 30,
      textAlign: 'center',
    },
    jobTitleTextInput: {
      fontSize: 20,
      height: 40,
      marginBottom: 20,
      borderBottomWidth: 1,
      width: '100%',
      padding: 4,
      backgroundColor: theme.color.white,
    },
    createdByText: {
      position: 'absolute',
      bottom: 10,
    },
    scrollViewContainer: {
      width: SCREEN_WIDTH,
      zIndex: 100,
      backgroundColor: '#1e1e1e',
    },
    addNewJobButton: {
      width: SCREEN_WIDTH * 0.4,
      position: 'absolute',
      bottom: 85,
      zIndex: 999,
    },
    scrollView: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      zIndex: 100,
      paddingBottom: 200,
    },
    addJobTouchable: {
      zIndex: 100,
    },
    header: {
      marginBottom: 20,
    },
    spinner: {
      position: 'absolute',
      top: SCREEN_HEIGHT / 2 - 15,
      left: SCREEN_WIDTH / 2 - 15,
      zIndex: 1,
    },
    jobMenuSpinner: {
      position: 'absolute',
      top: 100,
      left: SCREEN_WIDTH / 2 - 15,
      zIndex: 1,
    },
    modalStyles: {
      padding: 32,
    },
    jobItemModalAnimatedView: {
      opacity: fadeAnim,
      display: 'flex',
      width: '100%',
      height: '100%',
      alignItems: 'center',
    },
    menuListItem: {
      borderBottomWidth: 1,
      height: 60,
      justifyContent: 'center',
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    menuListText: {
      fontSize: 20,
      color: 'black',
      lineHeight: 25,
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 20,
      alignSelf: 'flex-end',
    },
    cogIconTouchable: {
      position: 'absolute',
      top: 80,
      left: 20,
      zIndex: 999,
    },
    cogIconStyles: {
      height: 30,
      width: 30,
    },
  });
  return styles;
};

export default useStyles;
