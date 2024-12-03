import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: 'white',
      margin: 0,
    },
    textSection: {
      flex: 6,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      marginTop: 20,
      backgroundColor: 'white',
    },
    textInput: {
      width: '90%',
      height: '90%',
      textAlignVertical: 'top',
      marginTop: 20,
    },
    addPreviousHeader: {
      fontSize: 23,
      marginBottom: 30,
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
