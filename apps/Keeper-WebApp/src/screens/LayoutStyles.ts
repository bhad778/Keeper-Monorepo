import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = (currentPath: string, isAJobSelected: boolean) => {
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
      // borderBottom: isAJobSelected && currentPath.includes('discover') ? '' : '2px solid white',
      borderBottom: '2px solid white',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: 50,
      paddingRight: 50,
    },
    navLinksContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      width: 500,
      position: 'relative',
      right: 12,
    },
    logoContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 50,
    },
    navItem: {
      height: 40,
      textDecoration: 'none',
      color: 'white',
    },
    jobBoardNav: {},
    discoverNav: {},
    matchesNav: {},
    profileNav: {},
    jobBoardNavText: {
      fontSize: 28,
      color: currentPath.includes('jobBoard') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    discoverNavText: {
      fontSize: 28,
      color: currentPath.includes('discover') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    employeeMatchesNav: {
      fontSize: 28,
      color: currentPath.includes('matches') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    employeeApplicationsNav: {
      fontSize: 28,
      color: currentPath.includes('applications') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    employeeMatchesText: {
      fontSize: 28,
      color: currentPath.includes('matches') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    matchesNavText: {
      fontSize: 28,
      color: currentPath.includes('matches') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    applicationsNavText: {
      fontSize: 28,
      color: currentPath.includes('applications') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    profileNavText: {
      fontSize: 28,
      color: currentPath.includes('profile') ? theme.color.pink : 'white',
      whiteSpace: 'nowrap',
    },
    settingsIcon: {
      width: 40,
    },
  } as const;

  return styles;
};

export default useStyles;
