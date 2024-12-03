import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isModal: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    scrollViewContainer: {
      backgroundColor: theme.color.primary,
      flex: 1,
      paddingTop: isModal ? 40 : 0,
    },
    scrollView: {
      backgroundColor: theme.color.primary,
      paddingBottom: 80,
    },
    contents: {
      paddingHorizontal: 10,
      backgroundColor: theme.color.primary,
    },
    openModalItem: {
      height: 70,
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    uploadResumeButton: {
      width: '98%',
      height: 45,
      marginTop: 15,
      marginBottom: 30,
      backgroundColor: theme.color.primary,
      borderWidth: theme.general.borderWidth,
      borderColor: 'white',
    },
    uploadResumeButtonText: {
      fontSize: 15,
      color: 'white',
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingLeft: 15,
    },
    cogIconStyles: {
      height: 30,
      width: 30,
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
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
    usCitizenSection: {},
    usCitizenContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 10,
    },
    section: {
      marginBottom: 19,
    },
    workSettingsContainer: {
      marginTop: 5,
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
      fontSize: 18,
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
      height: 55,
      borderWidth: 0,
      top: -10,
      marginTop: 20,
      marginBottom: 30,
    },
    previewJobButtonText: {
      color: theme.color.black,
    },
    citizenButtons: {
      width: '50%',
      height: 45,
    },
    bottomSheetText: {
      fontSize: 22,
      lineHeight: 28,
    },
    workSettingButtons: {
      width: '33%',
      height: 45,
    },
    employmentTypeButtons: {
      width: '50%',
      height: 45,
    },
    uncompletedFieldsString: {
      color: 'black',
      paddingTop: 15,
      fontSize: 18,
      paddingHorizontal: 10,
    },
    workSettingButtonText: {
      fontSize: 16,
    },
    onSiteScheduleContainer: {
      flexDirection: 'row',
    },
    selectedButtonStyles: {
      backgroundColor: theme.color.pink,
    },
    unSelectedButtonStyles: {
      backgroundColor: theme.color.primary,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
    },
    unSelectedTextStyles: {
      color: theme.color.white,
    },
  });
  return styles;
};

export default useStyles;
