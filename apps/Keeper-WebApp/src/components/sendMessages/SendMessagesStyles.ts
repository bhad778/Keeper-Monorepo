import { useTheme } from 'theme/theme.context';

export const useStyles = (color: string, isEmployee: boolean) => {
  const { theme } = useTheme();
  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      flex: 1,
      display: 'flex',
      height: '100%',
      width: '100%',
      flexDirection: 'column',
      borderLeft: 'solid #282828 .5px',
    },
    avatar: {
      height: 'unset',
      width: isEmployee ? '100%' : 'unset',
      borderRadius: isEmployee ? 0 : 300,
      objectFit: 'cover',
      maxHeight: '30vh',
    },
    messagesNameAndTitleContainer: {
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
    },
    sendMessageHeader: {
      backgroundColor: color,
      height: 500,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      paddingTop: !isEmployee ? 15 : 'unset',
      paddingBottom: 20,
    },
    logoContainer: { width: isEmployee ? '100%' : 'unset' },
    messageeNameContainer: {
      display: 'flex',
      height: '100%',
      width: '100%',
    },
    title: {
      fontSize: 28,
      color: 'black',
    },
    subTitle: {
      fontSize: 18,
      color: 'black',
      textTransform: 'uppercase',
    },
    xButtonContainer: {
      color: 'black',
      position: 'absolute',
      paddingLeft: 10,
      paddingTop: 10,
    },
    xIcon: {
      width: 45,
      height: 45,
    },
    messageInput: {
      backgroundColor: theme.color.primary,
      borderRadius: 0,
      width: '100%',
      boxShadow: 'none !important',
      borderTop: 'solid white 2px',
    },
  } as const;

  return styles;
};

export default useStyles;
