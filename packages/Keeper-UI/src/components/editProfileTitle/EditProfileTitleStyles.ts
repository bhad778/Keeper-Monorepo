import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    text: {
      fontSize: 17,
      color: theme.color.secondary,
    },
  });

  return styles;
};

export default useStyles;
