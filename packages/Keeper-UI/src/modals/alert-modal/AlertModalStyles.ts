import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    alertModal: {
      backgroundColor: theme.color.primary,
      padding: 15,
    },
    titleStyle: {
      fontSize: 35,
      color: 'white',
      paddingBottom: 10,
      textAlign: 'center',
    },
    subTitleStyle: {
      color: 'white',
      fontSize: 15,
      lineHeight: 18,
    },
    bottomButtonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 20,
    },
    bottomButtonStyles: {
      width: '45%',
      backgroundColor: 'white',
    },
    bottomButtonTextStyles: {
      color: 'black',
    },
  });

  return styles;
};

export default useStyles;
