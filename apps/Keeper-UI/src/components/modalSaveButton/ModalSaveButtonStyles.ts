import { useTheme } from 'theme/theme.context';
import { StyleSheet } from 'react-native';

export const useStyles = (disabled: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modalSaveButton: {
      backgroundColor: disabled ? theme.color.keeperGrey : theme.color.pink,
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 15,
      padding: 10,
    },
    modalSaveText: {
      color: 'black',
      fontSize: 20,
    },
  });

  return styles;
};

export default useStyles;
