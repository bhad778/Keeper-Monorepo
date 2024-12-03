import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    textSection: {
      flex: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.primary,
      paddingTop: 40,
    },
    keeperModal: {
      padding: 32,
      maxHeight: 600,
    },
    textInput: {
      width: '85%',
      height: '100%',
      textAlignVertical: 'top',
      color: theme.color.white,
      fontSize: 18,
      paddingBottom: 300,
    },
    addPreviousHeader: {
      fontSize: 23,
      marginBottom: 30,
    },
    scrollView: {
      flexGrow: 1,
    },
    screenScrollView: {
      paddingBottom: 400,
    },
    menuListItem: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 5,
    },
    menuListText: {
      fontSize: 18,
      color: 'black',
    },
  });

  return styles;
};

export default useStyles;
