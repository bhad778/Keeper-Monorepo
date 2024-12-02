import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modalContent: {
      borderRadius: 10,
      padding: 10,
      backgroundColor: theme.color.white,
    },
    titleText: {
      fontSize: 20,
    },
  });

  return styles;
};

export default useStyles;
