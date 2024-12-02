import { employerDiscoverHeaderHeight, navBarHeight } from 'constants/globalConstants';
import { useWindowDimensions } from 'hooks';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isOwner: boolean, isEmployee?: boolean, isModal?: boolean, isAJobSelected?: boolean) => {
  const { theme } = useTheme();

  const { windowHeight, windowWidth } = useWindowDimensions();

  const styles: { [k: string]: React.CSSProperties } = {
    resumeComponentContainer: {
      marginTop: 0,
      width: '100%',
      overflow: 'auto',
      height: `calc(100vh - ${navBarHeight}px - ${!isEmployee && isAJobSelected ? employerDiscoverHeaderHeight : 0}px)`,
      paddingLeft: 150,
      paddingRight: 150,
      position: 'relative',
    },
    resumeHeaderText: {
      color: theme.color.white,
    },
    jobHistoryContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    onSiteOptionsToContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: 15,
    },
    profilePicContainer: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: 20,
      paddingBottom: 20,
      paddingTop: 15,

      borderBottom: '2px solid',
      borderBottomColor: theme.color.white,
    },
    profileImgPlaceholderStyles: {
      width: '100%',
      height: 400,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.darkGrey,
      position: 'relative',
    },
    profileImgPlaceholder: {
      width: 350,
      position: 'absolute',
      bottom: 0,
    },
    backButton: {
      top: 5,
      left: 25,
    },
    jobHistorySection: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
    },
    browseNextbutton: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 100,
      backgroundColor: 'white',
      display: 'flex',
    },
    skillsSection: {
      flex: 1,
      marginTop: 40,
      marginBottom: 40,
    },
    educationDetailsSection: {
      flex: 1,
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
      paddingTop: 5,
    },
    text: {
      color: theme.color.white,
    },
    locationPin: {
      paddingBottom: 1,
      marginRight: 2,
    },
    topRowText: {
      color: theme.color.white,
    },
    aboutMeText: {
      textAlign: 'left',
      fontWeight: 'bold',
      width: '100%',
      marginBottom: 40,
    },
    profilePicture: {
      borderRadius: 40,
      width: '93%',
      marginBottom: 10,
      maxHeight: '45vh',
      objectFit: 'cover',
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
      left: windowWidth / 2,
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
    },
    addressText: {
      color: 'white',
      fontSize: 17,
    },
    onSiteOptionsOpenTo: {
      fontSize: 18,
    },
    name: {
      width: '100%',
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
      paddingBottom: 5,
      textTransform: 'capitalize',
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
    hidden: {
      display: 'none',
    },
    monthsText: {
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 15,
    },
    jobTitleContainer: {
      display: 'flex',
    },
    jobTitleText: {
      fontSize: 20,
      marginBottom: 10,
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
      // backgroundColor: isNew || isModal ? theme.color.pink : theme.color.primary,
      backgroundColor: theme.color.pink,
    },
    keepButtonTextLike: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
      // color: isNew || isModal ? theme.color.primary : theme.color.white,
      color: theme.color.primary,
    },
    keepButtonTextPass: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
      color: theme.color.white,
    },
    skillsTitle: {
      paddingBottom: 30,
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
    grid1: {
      paddingBottom: 150,
      paddingTop: isModal ? 0 : 10,
    },
    grid2: {
      marginTop: 10,
      paddingRight: 40,
      paddingBottom: 150,
      paddingTop: isModal ? 0 : 10,
    },
    chipText: {
      color: theme.color.white,
    },
    skillText: {
      fontSize: 17,
    },
    aboutMeSection: {},
    educationTitle: {
      marginTop: 20,
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
      borderBottomColor: theme.color.white,
    },
    lastEducationItemContainer: {
      // marginBottom: 20,
    },
    bulletPoint: {
      width: 5,
      height: 5,
      backgroundColor: theme.color.white,
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
    shareClickable: {
      position: 'absolute',
      right: 15,
      top: 20,
      display: 'flex',
    },
    shareIcon: {
      marginLeft: 1,
      color: isAJobSelected ? theme.color.primary : theme.color.white,
      bottom: 2,
      position: 'relative',
    },
    shareText: {
      color: isAJobSelected ? theme.color.primary : theme.color.white,
    },
  } as const;

  return styles;
};

export default useStyles;
