import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (isOwner?: boolean, isSeekingFirstJob?: boolean, jobColor?: string) => {
  const { theme } = useTheme();

  const horizontalPadding = 15;
  const verticalMarginBetweenSections = 28;

  const styles = StyleSheet.create({
    resumeComponentContainer: {
      backgroundColor: theme.color.primary,
      flex: 1,
      alignItems: 'center',
      zIndex: 1,
      overflow: 'hidden',
      paddingBottom: 80,
      paddingHorizontal: horizontalPadding,
    },
    section: {
      marginTop: verticalMarginBetweenSections / 2,
      marginBottom: verticalMarginBetweenSections / 2,
      width: '100%',
    },
    textSection: {
      marginTop: verticalMarginBetweenSections / 2 - 6,
      marginBottom: verticalMarginBetweenSections / 2 - 6,
      width: '100%',
    },
    ranOutOfLikesText: {
      // marginBottom: 20,
      width: '90%',
      fontSize: 20,
      lineHeight: 25,
      paddingTop: 5,
    },
    text: {
      color: theme.color.white,
    },
    profileImgPlaceholder: {
      backgroundColor: theme.color.darkGrey,
      width: '100%',
      height: 350,
    },
    locationPin: {
      paddingBottom: 12,
      marginRight: 2,
    },
    topRowText: {
      color: theme.color.white,
    },
    aboutMeText: {
      textAlign: 'left',
    },
    profilePicture: {
      height: SCREEN_WIDTH - horizontalPadding * 2,
      width: SCREEN_WIDTH - horizontalPadding * 2,
      borderRadius: theme.general.borderRadius,
    },
    profilePictureEmpty: {
      height: SCREEN_WIDTH - horizontalPadding * 2,
      width: SCREEN_WIDTH - horizontalPadding * 2,
      borderRadius: 4000,
      backgroundColor: theme.color.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      position: 'absolute',
      top: SCREEN_HEIGHT / 3,
      left: SCREEN_WIDTH / 2 - 10,
      zIndex: 1,
    },
    bottomDetailsSection: {
      alignItems: 'flex-start',
      height: 80,
    },
    onSiteOptionsContainer: {
      // justifyContent: 'center',
      // alignItems: 'flex-start',
    },
    onSiteOptionsChipsContainer: {
      flexDirection: 'row',
    },
    locationSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      // to offset padding around location pin icon
    },
    usCitizenSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addressText: {
      color: theme.color.white,
    },
    onSiteOptionsOpenTo: {
      fontSize: 18,
    },
    name: {
      width: '100%',
      marginBottom: 5,
    },
    position: {
      fontSize: 18,
      textTransform: 'capitalize',
      lineHeight: 24,
    },
    jobTitle: {
      fontSize: 23,
      fontWeight: '500',
      paddingBottom: 5,
    },
    usCitizen: {
      fontSize: 18,
      fontWeight: '500',
      paddingTop: 18,
      paddingLeft: 10,
    },
    jobHistoryTitleSection: {
      display: 'flex',
      justifyContent: 'center',
    },
    sectionTitle: {
      fontSize: 26,
      paddingBottom: 20,
      color: theme.color.white,
    },
    specificPastJob: {
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 20,
      paddingBottom: 10,
    },
    numberText: {
      fontSize: 16,
    },
    jobMonthsText: {
      fontSize: 16,
    },
    jobDetailsSection: {
      flex: 1,
      display: 'flex',
    },
    jobDetailsOpened: {
      display: 'flex',
      paddingBottom: 15,
    },
    hidden: {
      display: 'none',
    },
    monthsText: {
      marginTop: 0,
      // marginBottom: 0,
      paddingTop: 15,
    },
    jobTitleContainer: {
      display: 'flex',
    },
    jobTitleText: {
      fontSize: 20,
      // marginBottom: 10,
    },
    companyContainer: {
      display: 'flex',
    },
    companyText: {
      fontSize: 14,
      // marginBottom: 10,
    },
    angleDownIcon: {
      position: 'absolute',
      top: -10,
      alignSelf: 'flex-end',
    },
    keepButtonLike: {
      width: '100%',
      height: 60,
      borderWidth: theme.general.borderWidth,
      display: 'flex',
      flexDirection: 'row',
    },
    keepButtonPass: {
      width: '100%',
      height: 60,
      borderWidth: 2,
      borderColor: theme.color.black,
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'row',
    },
    keepButtonTextLike: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
    },
    keepButtonTextPass: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
      color: theme.color.black,
    },
    skillsTitle: {
      // paddingBottom: 30,
    },
    skillsListSection: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    chipContainer: {
      backgroundColor: theme.color.primary,
      borderWidth: 0.5,
      borderColor: theme.color.white,
    },
    chipText: {
      color: theme.color.white,
      fontSize: 14,
    },
    educationMajorText: {
      fontSize: 21,
    },
    educationDegreeAndSchoolText: {
      fontSize: 15,
      lineHeight: 22,
    },
    educationItemContainer: {
      // marginBottom: 20,
      paddingBottom: 20,
    },
    lastEducationItemContainer: {
      // marginBottom: 20,
    },
    bulletPoint: {
      width: 5,
      height: 5,
      backgroundColor: theme.color.black,
      borderRadius: 50,
      marginRight: 8,
      marginLeft: 8,
    },
    bottomAboutMeSection: {
      flex: 1,
      paddingBottom: 100,
    },
    addNewPastJobButton: {
      marginTop: 20,
    },
    addToEducationButton: {
      marginTop: 20,
    },
    doubleTapModalContainer: {
      height: 20,
    },
  });
  return styles;
};

export default useStyles;
