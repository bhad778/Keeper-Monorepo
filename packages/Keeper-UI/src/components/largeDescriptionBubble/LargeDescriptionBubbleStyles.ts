import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginVertical: 10,
    },
    touchable: {
      width: '100%',
      height: 120,
      backgroundColor: theme.color.primary,
      borderRadius: 17,
      borderColor: 'white',
      borderWidth: theme.general.borderWidth,
      zIndex: 1,
      padding: 10,
    },
    text: {
      color: theme.color.white,
      fontSize: 16,
    },
    placeholderText: {
      color: theme.color.secondary,
      fontSize: 17,
    },
  });

  return styles;
};

export default useStyles;
