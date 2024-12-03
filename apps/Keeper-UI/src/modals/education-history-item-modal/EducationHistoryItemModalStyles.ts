import { useTheme } from 'theme/theme.context';
import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (
  isInstituionRed: boolean,
  isAreaOfStudyRed: boolean,
  isDegreeTypeRed: boolean,
  isGraduationYearRed: boolean,
) => {
  const { theme } = useTheme();

  const padding = 20;

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    headerContainer: {
      paddingHorizontal: 13,
      marginBottom: 40,
    },
    institutionTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isInstituionRed ? theme.color.alert : theme.color.keeperGrey,
    },
    areaOfStudyTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isAreaOfStudyRed ? theme.color.alert : theme.color.keeperGrey,
    },
    degreeTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isDegreeTypeRed ? theme.color.alert : theme.color.keeperGrey,
    },
    graduationYearTitle: {
      fontSize: 17,
      marginBottom: 10,
      color: isGraduationYearRed ? theme.color.alert : theme.color.keeperGrey,
    },
    buttonsContainer: {
      width: SCREEN_WIDTH,
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    degreeButtons: {
      width: '45%',
    },
    contents: {
      padding,
      flex: 1,
      alignItems: 'center',
    },
    textInput: {
      fontSize: 25,
      height: 40,
      borderBottomWidth: 1,
      marginBottom: 18,
      borderColor: theme.color.white,
      color: theme.color.white,
    },
    jobTitleContainer: {
      width: '100%',
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
    companyDescriptionContainer: {
      width: '100%',
      alignItems: 'center',
      borderWidth: theme.general.borderWidth,
      marginBottom: 10,
      borderRadius: 20,
      marginTop: 15,
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
      paddingBottom: 20,
    },
    deleteButton: {
      width: '100%',
    },
    dateInputContainer: {
      width: '100%',
    },
    dateInput: {
      marginBottom: 4,
    },
    dateTextInput: {
      borderWidth: theme.general.borderWidth,
      padding: 2,
    },
    keyboardAvoidingView: {
      flex: 1,
      height: SCREEN_HEIGHT,
    },
    scrollView: {
      flex: 1,
    },
    startDate: {},
    endDate: {
      marginTop: 20,
    },
  });

  return styles;
};

export default useStyles;
