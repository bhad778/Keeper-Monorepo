import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (isValid: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.color.primary,
    },
    scrollContentsContainer: {
      backgroundColor: theme.color.primary,
      height: SCREEN_HEIGHT,
    },
    contents: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      width: '100%',
      paddingHorizontal: 30,
    },
    createAJobTextContainer: {
      // height: 80,
    },
    createAJobText: {
      textAlign: 'center',
      fontSize: 30,
      lineHeight: 0,
    },
    backButton: {
      position: 'absolute',
      top: 70,
      left: 25,
    },
    backButtonIcon: {
      height: 30,
      width: 30,
    },
    titleText: {
      color: theme.color.white,
      fontSize: 34,
    },
    subTitleText: {
      color: theme.color.white,
      fontSize: 14,
      lineHeight: 20,
    },
    keyboardAvoidingView: {
      width: SCREEN_WIDTH,
      paddingBottom: 100,
      backgroundColor: theme.color.primary,
    },
    keeperLogoContainer: {
      height: '25%',
      width: '100%',
      paddingTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      marginBottom: 20,
    },
    keeperLogo: {
      height: '70%',
      width: '70%',
    },
    iconTextContainer: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
    },
    submitButton: {
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      backgroundColor: isValid ? theme.color.pink : theme.color.primary,
      marginTop: 40,
      height: 60,
    },
    submitText: {
      fontSize: 24,
      color: isValid ? theme.color.primary : theme.color.white,
    },
    textInput: {
      textAlign: 'center',
      color: theme.color.white,
      fontSize: 30,
      borderBottomWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      height: 50,
      width: '100%',
      marginVertical: 30,
      paddingBottom: 10,
    },
  });
  return styles;
};

export default useStyles;
