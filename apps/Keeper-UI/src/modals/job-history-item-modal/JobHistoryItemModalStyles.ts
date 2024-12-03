import { useTheme } from 'theme/theme.context';
import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (
  isJobTitleRed: boolean,
  isCompanyNameRed: boolean,
  isJobDescriptionRed: boolean,
  isStartDateRed: boolean,
  isEndDateRed: boolean,
) => {
  const { theme } = useTheme();

  const padding = 20;

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    finishFieldsText: {
      color: theme.color.primary,
    },
    currentlyEmployedText: {
      color: theme.color.white,
    },
    checkMark: {
      paddingTop: 2,
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      marginBottom: 10,
    },
    contents: {
      padding,
      flex: 1,
      alignItems: 'center',
    },
    skillsContainer: {
      width: '100%',
    },
    jobTitleContainer: {
      width: '100%',
    },
    jobTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isJobTitleRed ? theme.color.alert : theme.color.keeperGrey,
    },
    companyTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isCompanyNameRed ? theme.color.alert : theme.color.keeperGrey,
    },
    jobDescriptionTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isJobDescriptionRed ? theme.color.alert : theme.color.keeperGrey,
    },
    startDateTitle: {
      fontSize: 15,
      marginBottom: 10,
      color: isStartDateRed ? theme.color.alert : theme.color.keeperGrey,
    },
    endDateTitle: {
      fontSize: 15,
      marginBottom: 10,
      color: isEndDateRed ? theme.color.alert : theme.color.keeperGrey,
    },
    appText: {
      color: '#cacaca',
    },
    jobTitleTextInput: {
      fontSize: 20,
      height: 40,
      marginBottom: 10,
      borderBottomWidth: 1,
      width: '100%',
      padding: 4,
      backgroundColor: theme.color.white,
    },
    jobDescriptionContainer: {
      width: '100%',
      marginBottom: 10,
      marginTop: 5,
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
    companyInfoButton: {
      width: '100%',
      height: 70,
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
    },
    buttonTextColor: {
      color: 'black',
      fontSize: 18,
    },
    datesContainer: {
      width: '100%',
      zIndex: 99999,
      paddingTop: 20,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    dateInputContainer: {
      width: '100%',
      height: 150,
    },
    dateInput: {
      marginBottom: 4,
    },
    dateTextInput: {
      borderWidth: theme.general.borderWidth,
      padding: 2,
    },
    deleteButtonContainer: {
      paddingHorizontal: 20,
      marginTop: -30,
      marginBottom: 30,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
  });

  return styles;
};

export default useStyles;
