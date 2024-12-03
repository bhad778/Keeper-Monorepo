import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    yrsExperienceContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      paddingTop: 110,
    },
    titleText: {
      fontSize: 20,
      marginTop: 15,
      textAlign: 'center',
    },
    yearsText: {
      fontSize: 38,
      color: theme.color.white,
      position: 'absolute',
      left: 40,
      top: 40,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    pickerContainer: {
      width: '50%',
      justifyContent: 'center',
      marginTop: 60,
    },
  });

  return styles;
};

export default useStyles;
