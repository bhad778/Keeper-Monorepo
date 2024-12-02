import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.primary,
    },
    nameIcon: {
      marginTop: 7,
    },
    contents: {
      height: '75%',
      alignItems: 'center',
      justifyContent: 'center',
      // paddingHorizontal: 20,
      paddingRight: 20,
      paddingLeft: 20,
      width: SCREEN_WIDTH,
    },
    keeperLogoContainer: {
      height: '25%',
      paddingTop: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: 'white',
      borderBottomWidth: 1,
    },
    keeperLogo: {
      height: '70%',
      width: '70%',
    },
    headerTextContainer: {
      alignItems: 'center',
      width: '100%',
      marginBottom: 16,
    },
    loginTextContainer: {
      alignItems: 'center',
      width: '100%',
      marginTop: 30,
    },
    headerText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    haveAccountText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
    },
    loginText: {
      fontSize: 20,
      color: theme.color.white,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      textAlign: 'center',
      color: 'white',
      fontSize: 22,
    },
    jobTypeButton: {
      width: SCREEN_WIDTH * 0.8,
      marginVertical: 8,
      padding: 13,
      borderRadius: 40,
      borderWidth: theme.general.borderWidth,
      borderColor: 'white',
    },
    textInput: {
      height: 40,
      width: '60%',
      margin: 10,
      marginLeft: 0,
      backgroundColor: 'white',
      borderColor: 'gray',
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 10,
    },
    nextButton: {
      width: 1,
      height: 40,
    },
  });
  return styles;
};

export default useStyles;
