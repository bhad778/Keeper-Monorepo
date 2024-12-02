import { StyleSheet, Dimensions, Platform } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      margin: 0,
      backgroundColor: theme.color.primary,
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
      height: '100%',
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      marginBottom: 30,
    },
    currentlyEmployedText: {
      color: theme.color.white,
    },
    headerStyles: {
      marginTop: Platform.OS === 'ios' ? 200 : 80,
    },
    maxCountText: {
      color: theme.color.text,
      fontSize: 25,
      textAlign: 'center',
      paddingBottom: 20,
    },
    chipsPickerContainer: {
      paddingTop: 30,
    },
  });

  return styles;
};

export default useStyles;
