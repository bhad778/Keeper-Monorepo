import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
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
      backgroundColor: 'grey',
    },
    sliderSection: {
      flex: 6,
      alignItems: 'center',
    },
    buttonsContainer: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 30,
      width: '100%',
      marginBottom: 20,
      flexWrap: 'wrap',
    },
    paymentTypeButtons: {
      width: '45%',
    },
  } as const;
  return styles;
};

export default useStyles;
