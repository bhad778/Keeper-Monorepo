import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      padding: 20,
      paddingTop: 0,
      marginTop: 20,
    },
    text: {
      color: theme.color.primary,
    },
    skillsPickerContainer: {
      width: '100%',
      height: '100%',
    },
    buttonTextStyles: {
      fontSize: 14,
    },
    titleText: {
      fontSize: 20,
      marginBottom: 25,
    },
    longTitleText: {
      fontSize: 16,
      marginBottom: 25,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    twoButton: {
      width: '40%',
      height: 45,
    },
    threeButton: {
      width: '30%',
      height: 45,
    },
    keepButtonLike: {
      width: '90%',
      height: 60,
      borderWidth: 0,
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 20,
    },
    keepButtonTextLike: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
    },
  });
  return styles;
};

export default useStyles;
