import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isOwnMessage: boolean, selectedJobColor?: string) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    messageRow: {
      width: '100%',
    },
    messageContainer: {
      backgroundColor: !isOwnMessage ? theme.color.keeperGrey : selectedJobColor || theme.color.primary,
      paddingVertical: 11,
      paddingHorizontal: 9,
      borderRadius: 17,
      borderBottomLeftRadius: isOwnMessage ? 17 : 0,
      borderBottomRightRadius: isOwnMessage ? 0 : 17,
      alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
      marginTop: -8,
      maxWidth: '90%',
    },
    messageText: {
      color: 'black',
    },
  });

  return styles;
};

export default useStyles;
