import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isValid: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.color.primary,
    },
    contents: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      width: '100%',
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
    text: {
      color: theme.color.white,
      fontSize: 24,
    },
    keeperLogoContainer: {
      height: '25%',
      width: '100%',
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
    },
    submitButton: {
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      marginTop: 40,
      height: 60,
      backgroundColor: isValid ? theme.color.pink : theme.color.primary,
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
      marginVertical: 10,
      paddingBottom: 10,
    },
  });
  return styles;
};

export default useStyles;
