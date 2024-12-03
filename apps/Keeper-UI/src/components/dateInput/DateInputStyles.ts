import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '40%',
    },
    placeholderColor: {
      color: 'white',
    },
  });

  return styles;
};

export default useStyles;
