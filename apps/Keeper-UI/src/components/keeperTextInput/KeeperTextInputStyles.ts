import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    textInput: {
      fontSize: 23,
      width: '100%',
      height: 50,
      borderBottomWidth: theme.general.borderWidth,
      marginBottom: 18,
      borderColor: theme.color.white,
      color: theme.color.white,
      fontFamily: 'app-bold-font',
      marginTop: 2,
      paddingBottom: 5,
    },
  });

  return styles;
};

export default useStyles;
