import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      height: `calc(100vh - ${navBarHeight}px)`,
      backgroundColor: theme.color.primary,
      overflow: 'hidden', // Prevent the entire page from scrolling
    },
    fullPageSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: `calc(100vh - ${navBarHeight}px)`, // Takes full height minus navbar
    },
    jobGridContainer: {
      width: '75%',
      padding: '20px',
      height: `calc(100vh - ${navBarHeight}px)`,
    },
    jobGrid: {
      width: '100%',
      height: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      overflowY: 'scroll', // Makes this section scrollable
      position: 'relative', // Ensures the spinner is correctly centered
      paddingBottom: '30px', // Add some padding at the bottom for better UX when scrolling
    },
    jobGridSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100px', // Fixed height for bottom spinner
      gridColumn: '1 / span 2', // Make the spinner take up the full width
    },
  };

  return styles;
};

export default useStyles;
