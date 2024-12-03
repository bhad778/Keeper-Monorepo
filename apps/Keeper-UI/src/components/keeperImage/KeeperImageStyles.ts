import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
    },
    emptyCompanyLogoContainer: {
      backgroundColor: theme.color.darkGrey,
    },
  });

  return styles;
};

export default useStyles;
