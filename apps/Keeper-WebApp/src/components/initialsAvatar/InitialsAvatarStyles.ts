import { useTheme } from 'theme/theme.context';

export const useStyles = (currentPath: string) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    keeperModal: {
      backgroundColor: theme.color.white,
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
    navItem: {
      textDecoration: 'none',
      color: 'white',
      cursor: 'pointer',
    },
    navText: {
      fontSize: 18,
      whiteSpace: 'nowrap',
    },
    logInNavText: {
      color: currentPath.includes('signUp') ? theme.color.pink : 'white',
    },
  } as const;

  return styles;
};

export default useStyles;
