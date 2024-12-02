import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (jobColor: string) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    addJobSection: {
      flex: 1,
      backgroundColor: theme.color.primary,
      paddingTop: 40,
    },
    scrollView: {
      paddingHorizontal: 10,
      backgroundColor: theme.color.primary,
      paddingBottom: 50,
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
    workSettingsButtonsContainer: {
      flexDirection: 'row',
      marginVertical: 10,
      left: -5,
    },
    workSettingButtons: {
      width: '32%',
    },
    workSettingButtonText: {
      fontSize: 19,
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
      // backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
    },
    error: {
      color: theme.color.alert,
    },
    titleText: {
      color: theme.color.white,
      fontSize: 16,
    },
    bottomSheetText: {
      fontSize: 22,
      lineHeight: 28,
      textAlign: 'center',
      color: theme.color.primary,
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
      borderBottomWidth: 0,
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
  });
  return styles;
};

export default useStyles;
