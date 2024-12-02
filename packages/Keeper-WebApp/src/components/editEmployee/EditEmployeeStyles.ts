import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      overflow: 'auto',
      height: theme.spacing.screenHeightWithNavbar,
      paddingLeft: 125,
      paddingRight: 125,
      top: 35,
      position: 'relative',
    },
    scrollView: {
      backgroundColor: theme.color.primary,
      paddingBottom: 20,
    },
    editModeSwitch: {
      position: 'absolute',
      top: navBarHeight + 70,
      right: 10,
      zIndex: 999,
      color: 'white',
    },
    locationSectionContainer: {
      // marginTop: 40,
    },
    saveButtonContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
    },
    saveJobButton: {
      backgroundColor: theme.color.pink,
      width: 150,
    },
    saveJobButtonText: {
      color: theme.color.primary,
    },
    grid1: {
      paddingBottom: 150,
    },
    grid1SubHeader: {
      fontSize: 20,
    },
    grid1SectionContainer: {
      marginBottom: 30,
    },
    grid2: {
      marginTop: 10,
      paddingRight: 40,
      paddingBottom: 150,
    },
    aboutMeSection: {
      marginBottom: 50,
    },
    jobHistorySection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginBottom: 60,
      marginTop: 50,
    },
    educationHistorySection: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    addResumeButton: {
      // margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      width: '100%',
      borderRadius: 30,
      backgroundColor: theme.color.white,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      display: 'flex',
    },
    addJobModal: {
      height: '95vh',
      width: '50vw',
      overflow: 'scroll',
      padding: 3,
    },
    finishFieldsModal: {},
    addJobSection: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
    },
    contents: {
      backgroundColor: theme.color.primary,
      width: '100%',
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    uploadResumeButton: {
      width: '100%',
      height: 45,
      marginTop: 15,
      marginBottom: 30,
      backgroundColor: theme.color.white,
      borderWidth: theme.general.borderWidth,
      borderColor: 'white',
    },
    uploadResumeButtonText: {
      color: theme.color.primary,
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
    jobTitleContainer: {
      width: '100%',
      marginBottom: 5,
    },
    resumeLabel: {
      marginBottom: 0,
    },
    appText: {
      color: '#cacaca',
      fontSize: 16,
    },
    uploadResumeText: {
      color: 'black',
      fontSize: 16,
    },
    jobInfoText: {
      color: 'rgba(0, 0, 0, 0.26)',
      fontSize: 15,
    },
    companyNameTitleContainer: {
      width: '100%',
    },
    jobInfoTitleContainer: {
      width: '98%',
      alignItems: 'flex-start',
    },
    companyInfoTitleContainer: {
      width: '98%',
      alignItems: 'flex-start',
      justifyContent: 'flex-end',
      height: 35,
    },
    companyInfoText: {
      color: 'rgba(0, 0, 0, 0.26)',
      fontSize: 15,
    },
    selectButton: {
      height: 50,
      width: 100,
      padding: 10,
    },
    section: {
      marginTop: 60,
    },
    usCitizenSection: {
      marginTop: 60,
      marginBottom: 80,
    },
    keeperSelectButtonsContainer: {
      display: 'flex',
    },
    employmentTypeContainer: {
      marginTop: 20,
    },
    workSettingButtons: {
      width: '33%',
      height: 45,
    },
    useCitizenText: {
      marginTop: 15,
      textAlign: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 70,
      marginTop: 20,
      marginBottom: 30,
      width: '100%',
      backgroundColor: theme.color.white,
      borderRadius: 30,
    },
    leftSideHeader: {
      width: '25%',
    },
    middleSectionHeader: {
      width: '40%',
    },
    rightSideHeader: {
      width: '30%',
    },
    jobTitleTextInput: {
      fontSize: 24,
      fontFamily: 'app-bold-font',
      height: 40,
      marginBottom: 4,
      borderBottomWidth: 1.5,
      width: '100%',
      padding: 4,
      backgroundColor: theme.color.white,
    },
    companyNameTextInput: {
      alignItems: 'flex-start',
      fontSize: 20,
      width: '100%',
      justifyContent: 'flex-end',
      padding: 4,
      borderBottomWidth: 1,
    },
    companyInfoButton: {
      width: '100%',
      height: 70,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    borderBottom: {
      borderBottomWidth: 1.5,
      borderBottomColor: 'black',
    },
    buttonTextColor: {
      color: 'black',
    },
    jobOverviewContainer: {
      width: '100%',
      alignItems: 'center',
      borderWidth: theme.general.borderWidth,
      marginTop: 15,
      marginBottom: 5,
      borderRadius: 20,
    },
    companyDescriptionContainer: {
      width: '100%',
      alignItems: 'center',
      borderWidth: theme.general.borderWidth,
      marginBottom: 10,
      borderRadius: 20,
    },
    textButton: {
      width: '100%',
      height: 100,
      backgroundColor: theme.color.white,
      borderRadius: 20,
      borderColor: 'rgba(0, 0, 0, 0.26)',
      zIndex: 1,
      paddingLeft: 10,
      paddingRight: 20,
    },
    textAreaLabel: {
      position: 'relative',
      zIndex: 2,
      alignSelf: 'center',
      marginTop: 7,
      width: '85%',
      fontSize: 18,
      marginBottom: 5,
    },
    button: {
      width: '60%',
    },
    previewJobButton: {
      width: '98%',
      backgroundColor: theme.color.white,
      borderWidth: 0,
      top: -10,
      marginTop: 20,
      marginBottom: 30,
    },
    previewJobButtonText: {
      color: theme.color.black,
    },
    citizenButtons: {
      width: '33%',
    },
    finishFieldsTitleContainer: {
      marginBottom: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    uncompletedFieldsContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    bottomSheetText: {
      fontSize: 25,
    },
    finishFieldsSubTitle: {
      fontSize: 18,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      color: theme.color.keeperGrey,
    },
    employmentTypeButtons: {
      width: '33%',
    },
    uncompletedFieldsString: {
      color: theme.color.alert,
      paddingTop: 15,
      fontSize: 18,
      textAlign: 'center',
    },
    onSiteScheduleContainer: {
      flexDirection: 'row',
    },
    selectedButtonStyles: {
      backgroundColor: theme.color.pink,
    },
    unSelectedButtonStyles: {
      border: `${theme.general.borderWidth}px solid white`,
    },
    unSelectedTextStyles: {
      color: theme.color.white,
    },
    selectedTextStyles: {
      color: theme.color.black,
    },
    uploadResumeButtonContainer: {
      width: '100%',
      marginBottom: 10,
      marginTop: 10,
    },
  } as const;

  return styles;
};

export default useStyles;
