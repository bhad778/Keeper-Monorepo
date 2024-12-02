import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (isBrowsing: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    jobPostingContent: {
      paddingBottom: isBrowsing ? 130 : 90,
    },
    jobOverviewSection: {
      marginBottom: 50,
      backgroundColor: theme.color.white,
      borderRadius: 35,
      minHeight: SCREEN_WIDTH,
      padding: 20,
      paddingTop: 40,
    },
    topSection: {
      alignItems: 'center',
      paddingTop: 10,
    },
    jobTitleSection: {
      borderBottomColor: theme.color.white,
      borderBottomWidth: 1,
      width: '95%',
      marginBottom: 12,
      paddingBottom: 10,
    },
    companyLogo: {
      height: SCREEN_WIDTH,
      width: SCREEN_WIDTH,
      marginBottom: 25,
    },
    emptyCompanyLogoContainer: {
      backgroundColor: theme.color.darkGrey,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: 280,
      marginBottom: 25,
    },
    companyLogoText: {
      color: theme.color.white,
      zIndex: 99,
      fontSize: 40,
      width: '80%',
      textAlign: 'center',
      lineHeight: 45,
    },
    jobTitleContainer: {
      fontSize: 30,
      letterSpacing: 1,
    },
    jobTitle: {
      color: theme.color.white,
    },
    companyName: {
      color: theme.color.white,
      fontSize: 20,
      marginBottom: 10,
    },
    requiredSkillsContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 20,
      flexWrap: 'wrap',
      width: '80%',
    },
    fullTimeAndCityContainer: {
      flexDirection: 'row',
      marginBottom: 5,
    },
    onSiteScheduleText: {
      marginTop: 5,
    },
    isFullTimeText: {
      marginRight: 10,
      color: theme.color.white,
    },
    onSiteAddressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    bottomHalfContainer: {
      paddingHorizontal: 10,
    },
    cityText: {
      fontSize: 18,
    },
    arrowDownDayInTheLifeSvg: {
      width: 15,
      tintColor: theme.color.white,
      height: 15,
    },
    arrowDownSvg: {
      width: 15,
      height: 15,
    },
    perksText: {
      marginTop: 20,
    },
    salaryOrHourlyText: {
      fontSize: 22,
      lineHeight: 25,
      fontWeight: '500',
    },
    jobOverviewText: {
      color: theme.color.white,
      fontSize: 35,
      marginBottom: 35,
    },
    benefitText: {
      color: theme.color.white,
      fontSize: 35,
    },
    theRoleText: {
      color: theme.color.black,
      marginBottom: 10,
    },
    theRoleContentText: {
      color: theme.color.black,
    },
    appHeaderText: {
      paddingBottom: 20,
      color: 'white',
    },
    aDayInTheLifeText: {
      color: theme.color.white,
      fontSize: 35,
      marginBottom: 20,
    },
    responsibility: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingBottom: 25,
    },
    arrowContainer: {
      width: 30,
      paddingBottom: 3,
    },
    yourAFitText: {
      flexWrap: 'wrap',
      width: SCREEN_WIDTH - 75,
      color: theme.color.black,
      fontSize: 16,
    },
    dailyResponsibilityText: {
      flexWrap: 'wrap',
      width: SCREEN_WIDTH - 75,
      color: theme.color.white,
    },
    locationContainer: { flexDirection: 'row', alignItems: 'center', left: 10 },
    section: {
      marginVertical: 20,
    },
    whiteBubble: {
      backgroundColor: theme.color.white,
      borderRadius: 35,
      padding: 25,
      paddingBottom: 30,
      paddingRight: 40,
    },
    skillsSection: {
      display: 'flex',
      paddingBottom: 20,
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
      flexDirection: 'row',
    },
    skillText: {
      color: theme.color.white,
      fontSize: 17,
      lineHeight: 26,
    },
    bulletPoint: {
      width: 6,
      height: 6,
      backgroundColor: theme.color.white,
      borderRadius: 100,
      marginTop: 3,
      marginRight: 8,
      marginLeft: 8,
    },
    hidden: {
      display: 'none',
    },
    header: {
      zIndex: 101,
      paddingLeft: 15,
      paddingRight: 15,
      width: '100%',
    },
    headerPill: {
      backgroundColor: theme.color.white,
      width: '100%',
      height: 72,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      zIndex: 101,
      marginTop: 50,
      borderWidth: theme.general.borderWidth,
      marginBottom: 20,
    },
    leftSection: {
      height: '100%',
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightSection: {
      height: '100%',
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleSection: {
      height: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 6,
    },
    titleText: {
      fontSize: 20,
    },
    keepButtonContainer: {
      paddingRight: 10,
      marginTop: 15,
    },
    keepButton: {
      width: '100%',
      height: 60,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    likeThisJobButton: {
      marginBottom: 8,
    },
    jobPostButtonSelected: {
      fontSize: 20,
      color: theme.color.black,
    },
    jobPostButtonUnselected: {
      fontSize: 20,
      color: theme.color.white,
    },
    keepButtonText: {
      fontSize: 20,
    },
    doubleTapModalContainer: {
      height: 20,
    },
  });
  return styles;
};

export default useStyles;
