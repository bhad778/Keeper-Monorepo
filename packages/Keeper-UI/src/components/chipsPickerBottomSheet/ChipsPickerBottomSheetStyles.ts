import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    chipsPickerContainer: {
      width: '100%',
      height: '100%',
    },
    keeperButtonStyles: {
      width: 100,
    },
    buttonTextStyles: {
      fontSize: 14,
    },
    chipsScrollView: {
      paddingLeft: 10,
    },
    searchInput: {
      height: 50,
      borderBottomWidth: theme.general.borderWidth,
      borderColor: 'black',
      color: 'white',
      width: '90%',
      marginLeft: 20,
      marginBottom: 20,
    },
  });

  return styles;
};

export default useStyles;
