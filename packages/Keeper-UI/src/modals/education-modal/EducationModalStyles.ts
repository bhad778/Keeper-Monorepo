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
      backgroundColor: theme.color.primary,
    },
    buttonsContainer: {
      width: SCREEN_WIDTH,
      marginTop: 60,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  });

  return styles;
};

export default useStyles;
