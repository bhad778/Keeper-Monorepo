import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (isValid: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.color.primary,
    },
    contents: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 30,
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
    keyboardAvoidingView: {
      width: SCREEN_WIDTH,
      flex: 1,
    },
    text: {
      color: theme.color.white,
      fontSize: 24,
    },
    keeperLogoContainer: {
      height: '25%',
      width: SCREEN_WIDTH,
      paddingTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      marginBottom: 100,
    },
    keeperLogo: {
      height: '70%',
      width: '70%',
    },
    iconTextContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    submitButton: {
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      backgroundColor: isValid ? theme.color.pink : 'unset',
      marginTop: 40,
      height: 60,
    },
    submitText: {
      fontSize: 24,
    },
    textInput: {
      textAlign: 'center',
      color: theme.color.white,
      fontSize: 30,
      borderBottomWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      height: 40,
      width: '100%',
      marginVertical: 10,
    },
  });
  return styles;
};

export default useStyles;
