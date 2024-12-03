import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const size = 80;

  const styles: { [k: string]: React.CSSProperties } = {
    container: {},
    signUpContainer: {},
    keeperModal: {
      backgroundColor: theme.color.white,
    },
    initialsAvatar: {
      height: size,
      width: size,
      borderRadius: 99,
      backgroundColor: theme.color.secondary,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    initialsText: {
      fontSize: 30,
      color: theme.color.primary,
    },
    modalItem: {
      backgroundColor: theme.color.white,
      borderBottom: '1px solid black',
      padding: 10,
    },
    modalItemText: {
      fontSize: 24,
      color: theme.color.black,
      textAlign: 'center',
    },
    signUpText: {
      fontSize: 24,
      color: theme.color.white,
    },
    finishProfileText: {
      fontSize: 24,
      color: 'white',
      textAlign: 'center',
    },
    finishProfileClickable: {
      display: 'flex',
    },
    signInLinksContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: 200,
    },
  } as const;

  return styles;
};

export default useStyles;
