import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    touchable: {
      zIndex: 1,
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
    },
  });

  return styles;
};

export default useStyles;
