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
    textInputContainer: {
      flex: 4,
      alignItems: 'center',
      padding: 20,
    },
    textInput: {
      paddingTop: 20,
      padding: 15,
      height: '40%',
      width: '100%',
      color: theme.color.white,
    },
  });

  return styles;
};

export default useStyles;
