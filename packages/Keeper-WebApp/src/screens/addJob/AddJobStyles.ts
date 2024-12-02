import { useTheme } from 'theme/theme.context';

export const useStyles = (isPreviewMode: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    addEditJobContainer: {
      height: theme.spacing.screenHeightWithNavbar,
      paddingLeft: isPreviewMode ? 0 : theme.spacing.horizontalPadding,
      paddingRight: isPreviewMode ? 0 : theme.spacing.horizontalPadding,
      overflow: 'auto',
      paddingTop: isPreviewMode ? 0 : 50,
      position: 'relative',
    },
    workSettingsContainer: {
      marginBottom: 60,
      marginTop: 60,
    },
    grid1: {
      paddingTop: 40,
    },
    previewButton: {
      backgroundColor: theme.color.pink,
      position: 'absolute',
      right: 180,
      top: 10,
      width: 200,
    },
    saveJobButton: {
      backgroundColor: theme.color.pink,
      position: 'absolute',
      left: `calc(100vw / 2 - 67px`,
      top: 10,
      width: 200,
    },
    saveJobButtonText: {
      color: theme.color.primary,
    },
    scrollView: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    bottomSectionContainer: {
      marginTop: 60,
      overflow: 'auto',
    },
    backButtonContainer: {
      // left: 10,
      // top: 10,
      // position: 'absolute',
      left: 175,
    },
    // saveJobButton: {
    //   padding: 10,
    //   borderRadius: 40,
    //   display: 'flex',
    //   flexDirection: 'column',
    //   alignItems: 'center',
    //   backgroundColor: theme.color.white,
    // },
    addJobItemContainer: {},
    addJobItemContainerCompanyDescription: {
      marginTop: 35,
    },
    jobTitleContainer: {
      width: '100%',
      marginTop: 20,
    },
    appText: {
      color: '#cacaca',
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
    selectButtonText: {
      fontSize: 14,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 70,
      marginTop: 20,
      marginBottom: 30,
      width: '100%',
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
    onSiteScheduleContainer: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 83,
      justifyContent: 'flex-start',
      display: 'flex',
    },
    workSettingButtons: {
      width: '32%',
      marginRight: 2,
      border: '1px solid white',
      height: 45,
    },
    workSettingButtonText: {
      fontSize: 19,
    },
    selectedButtonStyles: {
      backgroundColor: theme.color.pink,
      border: 'none',
    },
    uncompletedFieldsContainer: {
      marginTop: 40,
    },
    uncompletedFieldsString: {
      color: theme.color.white,
    },
    unSelectedButtonStyles: {
      backgroundColor: theme.color.primary,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
    },
    unSelectedTextStyles: {
      color: theme.color.white,
    },
    jobTitleTextInput: {
      fontSize: 20,
      height: 40,
      marginBottom: 20,
      borderBottomWidth: 1,
      borderColor: theme.color.white,
      width: '100%',
      padding: 4,
      backgroundColor: theme.color.primary,
    },
    companyNameTextInput: {
      alignItems: 'flex-start',
      fontSize: 20,
      width: '100%',
      height: 40,
      justifyContent: 'flex-end',
      padding: 4,
      borderBottomWidth: 1,
      marginBottom: 18,
      borderColor: theme.color.white,
    },
    jobBoardHeader: {
      marginTop: 30,
      height: 100,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    headerLeftSection: {
      height: '100%',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backIcon: {
      height: 20,
      width: 20,
    },
    error: {
      color: theme.color.alert,
    },
    bottomSheetText: {
      fontSize: 22,
      textAlign: 'center',
      color: 'white',
    },
    headerMiddleSection: {
      height: '100%',
      width: '60%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerRightSection: {
      height: '100%',
      width: '20%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    jobBoardHeaderText: {
      fontSize: 50,
      color: theme.color.white,
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    noBottomBorder: {
      flexDirection: 'row',
    },
    largeDescriptionBubble: {
      width: '100%',
      alignItems: 'center',
      borderWidth: theme.general.borderWidth,
      marginBottom: 10,
      borderRadius: 20,
    },
    largeDescriptionBubbleTouchable: {
      width: '100%',
      height: 120,
      backgroundColor: theme.color.primary,
      borderRadius: 13,
      borderColor: 'white',
      borderWidth: theme.general.borderWidth,
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
      backgroundColor: 'white',
      borderWidth: 0,
      marginTop: 15,
      marginBottom: 40,
    },
    previewJobText: {
      color: 'black',
    },
  } as const;
  return styles;
};

export default useStyles;
