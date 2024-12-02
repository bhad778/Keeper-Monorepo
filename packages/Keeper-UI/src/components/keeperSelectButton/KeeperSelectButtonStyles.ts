import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isBig: boolean, selected?: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    benefitButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: '100%',
      borderRadius: 30,
      backgroundColor: theme.color.primary,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
    },
    benefitsButtonsPressed: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 30,
      borderWidth: theme.general.borderWidth,
      backgroundColor: theme.color.pink,
    },
    buttonTextPressed: {
      fontSize: isBig ? 20 : 18,
      color: theme.color.white,
    },
    buttonText: {
      fontSize: isBig ? 20 : 18,
      color: selected ? 'black' : 'white',
    },
    smallButtonText: {
      fontSize: 18,
    },
    bigButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: '47%',
      borderRadius: 30,
    },
    bigButtonText: {
      fontSize: 20,
    },
  });

  return styles;
};

export default useStyles;
