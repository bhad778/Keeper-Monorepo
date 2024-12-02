import { useTheme } from 'theme/theme.context';

export const useStyles = (isOwnMessage: boolean, selectedJobColor?: string, isEmployee?: boolean) => {
  const { theme } = useTheme();

  const returnMessageColor = () => {
    if (isOwnMessage && isEmployee) {
      return theme.color.pink;
    } else if (isOwnMessage && !isEmployee) {
      return selectedJobColor || theme.color.primary;
    } else {
      return theme.color.keeperGrey;
    }
  };

  const styles: { [k: string]: React.CSSProperties } = {
    messageRow: {
      width: '100%',
      display: 'flex',
      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
    },
    messageContainer: {
      backgroundColor: returnMessageColor(),
      padding: 10,
      borderRadius: 17,
      borderBottomLeftRadius: isOwnMessage ? 17 : 0,
      borderBottomRightRadius: isOwnMessage ? 0 : 17,
      marginTop: -8,
      maxWidth: '90%',
    },
    messageText: {
      color: 'black',
    },
  } as const;

  return styles;
};

export default useStyles;
