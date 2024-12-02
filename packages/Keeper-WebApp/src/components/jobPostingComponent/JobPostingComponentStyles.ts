import { useTheme } from 'theme/theme.context';
import { useWindowDimensions } from 'hooks';

export const useStyles = (isOwner?: boolean, isModal?: boolean) => {
  const { theme } = useTheme();
  const { windowHeight, windowWidth } = useWindowDimensions();

  const styles: { [k: string]: React.CSSProperties } = {
    jobPostingContainer: {
      margin: 0,
      width: '100%',
      overflow: 'auto',
      height: theme.spacing.screenHeightWithNavbar,
      paddingLeft: 150,
      paddingRight: 150,
    },
    emptyCompanyLogoContainer: {
      width: '93%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
      marginBottom: 10,
      maxHeight: '43vh',
    },
    companyLogoText: {
      color: theme.color.white,
      bottom: 50,
      fontSize: 40,
      width: '80%',
      textAlign: 'center',
    },
    backButton: {
      marginTop: 20,
      padding: 5,
      borderRadius: 40,
      width: '33%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.white,
    },
    backButtonContainer: {
      position: 'relative',
      left: 0,
    },
    backTextStyles: {
      flex: 'none',
    },
    backArrow: {
      width: 10,
      height: 10,
    },
    backArrowContainer: {
      paddingLeft: 10,
    },
    goBackText: {
      color: theme.color.black,
      flex: 1,
      textAlign: 'center',
      paddingRight: 15,
    },
    grid1: {
      paddingBottom: 150,
      paddingTop: isModal ? 0 : 10,
    },
    grid2: {
      // marginTop: 10,
      paddingRight: 40,
      paddingBottom: 150,
      paddingTop: isModal ? 0 : 10,
    },
    jobHistorySection: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    nextButtonText: {
      color: theme.color.primary,
    },
    browseNextbutton: {
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      backgroundColor: 'white',
      display: 'flex',
    },
    skillsSection: {
      flex: 1,
      marginTop: 40,
      marginBottom: 15,
    },
    educationDetailsSection: {
      flex: 1,
    },
    companyName: {
      fontSize: 24,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      backgroundColor: 'white',
      borderRadius: 100,
      marginTop: 3,
      marginRight: 8,
      marginLeft: 8,
    },
    hidden: {
      display: 'none',
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
      paddingTop: 5,
    },
    responsibility: {
      display: 'flex',
      paddingBottom: 25,
      width: '100%',
    },
    arrowContainer: {
      marginRight: 15,
      paddingTop: 5,
    },
    rightArrow: {
      color: theme.color.white,
      bottom: 2,
      height: 10,
      width: 10,
      position: 'relative',
    },
    jobTitleText: {
      lineHeight: 1.2,
      color: 'white',
      width: '100%',
    },
    pictureAndInfoContainer: {
      borderBottom: 'white solid 1.5px',
      marginTop: 10,
      marginBottom: 20,
    },
    profileImgPlaceholder: {
      backgroundColor: theme.color.darkGrey,
      width: '100%',
      height: 360,
    },
    locationPin: {
      paddingBottom: 1,
      marginRight: 2,
    },
    topRowText: {
      color: theme.color.primary,
    },
    aboutMeText: {
      textAlign: 'left',
      fontWeight: 'bold',
    },
    profilePicContiainer: {
      minHeight: '35vh',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
    },
    profilePicture: {
      borderRadius: 0,
      width: '93%',
      marginBottom: 10,
      maxHeight: '40vh',
    },
    profilePictureEmpty: {
      height: windowWidth - 30,
      width: windowWidth - 30,
      borderRadius: 4000,
      backgroundColor: theme.color.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spinner: {
      position: 'absolute',
      top: windowHeight / 3,
      left: windowWidth / 2 - 10,
      zIndex: 1,
    },

    nameContainer: {
      borderBottomWidth: 2,
      borderColor: isOwner ? theme.color.white : '',
    },
    bottomDetailsSection: {
      paddingTop: 15,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
      height: 80,
    },
    onSiteOptionsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationSection: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 30,
      // to offset padding around location pin icon
    },
    addressText: {
      // color: jobColor ? 'black' : 'white',
      color: 'white',
      fontWeight: 'bold',
    },
    onSiteOptionsOpenTo: {
      fontSize: 18,
    },

    jobTitle: {
      fontSize: 23,
      fontWeight: '500',
      paddingBottom: 5,
    },
    position: {
      fontSize: 22,
      fontWeight: 'bold',
      borderBottomWidth: '3',
      borderBottomColor: 'white',
      marginBottom: 20,
    },
    usCitizen: {
      fontSize: 18,
      fontWeight: '500',
      paddingTop: 18,
      paddingLeft: 10,
    },
    experienceDetailsSection: {
      display: 'flex',
      flex: 1,
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
      marginTop: 15,
      paddingBottom: 15,
    },
    monthsText: {
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 15,
    },
    jobTitleContainer: {
      display: 'flex',
    },

    companyContainer: {
      display: 'flex',
    },
    companyText: {
      fontSize: 14,
      marginBottom: 10,
    },
    angleDownIcon: {
      position: 'absolute',
      top: -10,
      alignSelf: 'flex-end',
    },

    keepButtonLike: {
      width: '99%',
      height: 60,
      marginBottom: 10,
      borderWidth: theme.general.borderWidth,
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: !isOwner ? theme.color.pink : theme.color.primary,
    },
    keepButtonTextLike: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
      color: !isOwner ? theme.color.primary : theme.color.white,
    },
    keepButtonTextPass: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
      color: theme.color.black,
    },
    skillsTitle: {
      // marginTop: 30,
      // paddingBottom: 30,
    },
    skillsListSection: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    skillContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
      flexDirection: 'row',
    },
    chipContainer: {
      // paddingHorizontal: 12,
      padding: 0,
      paddingLeft: 10,
      paddingRight: 10,
      borderWidth: 0,
    },
    chipText: {
      color: 'black',
    },
    skillText: {
      fontSize: 17,
    },
    aboutMeSection: {
      // paddingBottom: 20,
    },
    educationTitle: {
      //marginBottom: 10,
    },
    educationMajorText: {
      fontSize: 21,
      marginTop: 10,
    },
    educationDegreeAndSchoolText: {
      fontSize: 15,
      marginTop: 5,
    },
    educationItemContainer: {
      marginBottom: 20,
      paddingBottom: 20,
      borderBottomWidth: 2,
      borderBottomColor: theme.color.black,
    },
    lastEducationItemContainer: {
      // marginBottom: 20,
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
    shareClickable: {
      position: 'absolute',
      right: isOwner ? 20 : 45,
      top: 20,
      display: 'flex',
    },
    shareIcon: {
      marginLeft: 1,
      color: 'white',
      bottom: 2,
      position: 'relative',
    },
  } as const;

  return styles;
};

export default useStyles;
