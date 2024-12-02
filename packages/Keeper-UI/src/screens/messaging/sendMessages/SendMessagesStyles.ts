import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (color: string) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color || 'white',
    },
    safeAreaView: {
      backgroundColor: color || 'white',
    },
    avatar: {
      height: 60,
      width: 60,
      borderRadius: 40,
      marginRight: 2,
    },
    messageList: {
      backgroundColor: theme.color.primary,
    },
    messageListScroller: {
      backgroundColor: theme.color.primary,
    },
    messageInputWrapper: {
      backgroundColor: theme.color.primary,
      paddingTop: 20,
      paddingBottom: 40,
      borderColor: 'white',
    },
    messageInput: {
      backgroundColor: theme.color.primary,
      maxWidth: SCREEN_WIDTH * 0.8,
      borderColor: 'white',
      borderWidth: 2,
      height: 63,
      paddingTop: 18,
      paddingLeft: 30,
      borderRadius: 30,
      color: 'white',
      fontSize: 18,
    },
    messageInputPlaceholder: {
      position: 'absolute',
      color: 'white',
    },
    keyboardAvoidingView: {
      flex: 1,
      backgroundColor: color,
    },
  });

  return styles;
};

export default useStyles;
