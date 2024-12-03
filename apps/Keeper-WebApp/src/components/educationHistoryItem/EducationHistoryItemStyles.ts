import { useTheme } from 'theme/theme.context';

export const useStyles = (
  isInstituionRed: boolean,
  isAreaOfStudyRed: boolean,
  isDegreeTypeRed: boolean,
  isGraduationYearRed: boolean
) => {
  const { theme } = useTheme();

  const padding = 20;
  const titleFontSize = 24;

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      // height: '80vh',
      width: '60vw',
      padding: 2,
    },
    headerContainer: {
      paddingLeft: 13,
      paddingRight: 13,
      marginBottom: 40,
    },
    institutionTitle: {
      color: isInstituionRed ? theme.color.alert : theme.color.keeperGrey,
      fontSize: titleFontSize,
    },
    areaOfStudyTitle: {
      color: isAreaOfStudyRed ? theme.color.alert : theme.color.keeperGrey,
      fontSize: titleFontSize,
    },
    degreeTitle: {
      color: isDegreeTypeRed ? theme.color.alert : theme.color.keeperGrey,
      fontSize: titleFontSize,
    },
    graduationYearTitle: {
      color: isGraduationYearRed ? theme.color.alert : theme.color.keeperGrey,
      fontSize: titleFontSize,
    },
    saveAndDeleteButtonsContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    buttonsContainer: {
      width: '100%',
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexWrap: 'wrap',
      display: 'flex',
    },
    degreeButtons: {
      width: '45%',
      border: `${theme.color.white} solid 1.5px`,
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
      height: '100%',
    },
    scrollView: {
      flex: 1,
    },
    startDate: {},
    endDate: {
      marginTop: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
