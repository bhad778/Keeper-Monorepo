import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = (currentPath: string) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      width: '100%',
      height: '100%',
    },
    navBar: {
      backgroundColor: theme.color.primary,
      height: navBarHeight,
      width: '100%',
      flexDirection: 'row',
      borderBottom: '2px solid white',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 50,
      paddingRight: 50,
    },
    logoTextContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    navLinksContainer: {
      display: 'flex',
      position: 'relative',
      alignItems: 'center',
      gap: 20,
    },
    logoText: {
      color: 'white',
      fontSize: 24,
    },
    subLogoText: {
      color: theme.color.secondary,
      fontSize: 14,
      paddingTop: 5,
      marginLeft: 4,
    },
    navItem: {
      textDecoration: 'none',
      color: 'white',
    },
    navText: {
      fontSize: 18,
      whiteSpace: 'nowrap',
    },
    jobsNavText: {
      color: currentPath.includes('Jobs') ? theme.color.pink : 'white',
    },
    companiesNavText: {
      color: currentPath.includes('Companies') ? theme.color.pink : 'white',
    },
    logInNavText: {
      color: currentPath.includes('logIn') ? theme.color.pink : 'white',
    },
  } as const;

  return styles;
};

export default useStyles;
