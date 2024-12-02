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
    benefitButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: '47%',
      borderRadius: 30,
    },
    buttonText: {
      fontSize: 20,
    },
    smallButtonText: {
      fontSize: 18,
    },
    sliderSection: {
      flex: 6,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    buttonsContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      width: '100%',
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    compensationTypeText: {
      fontSize: 16,
      marginBottom: 20,
      color: theme.color.white,
    },
    targetPay: {
      color: theme.color.white,
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });
  return styles;
};

export default useStyles;
