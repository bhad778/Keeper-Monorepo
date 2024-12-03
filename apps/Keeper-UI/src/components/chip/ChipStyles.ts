import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    chip: {
      borderRadius: 19,
      height: 30,
      marginVertical: 5,
      marginHorizontal: 3,
      paddingLeft: 10,
      paddingRight: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: theme.color.primary,
      borderColor: theme.color.white,
      borderWidth: 0.5,
    },
    chipText: {
      textAlign: 'center',
      textTransform: 'capitalize',
      color: theme.color.white,
      fontSize: 14,
    },
    icon: {
      marginLeft: 10,
    },
  });

  return styles;
};

export default useStyles;
