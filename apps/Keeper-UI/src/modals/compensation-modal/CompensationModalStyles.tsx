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
    text: {
      color: theme.color.text,
    },
    smallButtonText: {
      fontSize: 18,
    },
    salaryConversionRangeTitle: {
      marginTop: 20,
    },
    touchDimensions: {
      height: 100,
      width: 100,
      borderRadius: 15,
      slipDisplacement: 200,
    },
    markerStyle: {
      height: 30,
      width: 30,
    },
    selectedStyle: {
      backgroundColor: theme.color.pink,
    },
    sliderSection: {
      flex: 6,
      padding: 20,
      alignItems: 'center',
    },
    buttonsContainer: {
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 60,
      width: '100%',
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    paymentTypeButtons: {
      width: '45%',
    },
  });
  return styles;
};

export default useStyles;
