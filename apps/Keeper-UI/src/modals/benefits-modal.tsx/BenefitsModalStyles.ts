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
    educationTypeContainer: {
      flex: 5,
      alignItems: 'center',
      padding: 20,
    },
    benefitButtonsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 60,
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
  });

  return styles;
};

export default useStyles;
