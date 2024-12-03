import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    yearsOfExperienceText: {
      color: theme.color.white,
      fontSize: 26,
    },
    slider: {
      width: '100%',
      height: 40,
    },
  });

  return styles;
};

export default useStyles;
