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
    sidebar: {
      width: '25%',
      padding: '20px',
      backgroundColor: theme.color.primary,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    },
    searchBar: {
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid white`,
      fontSize: '16px',
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    filterTitle: {
      marginBottom: '5px',
      color: theme.color.white,
      fontWeight: 'bold',
    },
    filterOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '10px',
    },
    filterButton: {
      padding: '10px 15px',
      borderRadius: '20px',
      backgroundColor: theme.color.secondary,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    filterButtonSelected: {
      backgroundColor: theme.color.pink, // Ensure this matches your selected filter style
      transform: 'scale(1.1)', // Slight scale effect for selected filters
    },
    jobGrid: {
      width: '75%',
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      overflowY: 'scroll', // Makes this section scrollable
      height: `calc(100vh - ${navBarHeight}px)`,
      position: 'relative', // Ensures the spinner is correctly centered
    },
    jobGridSpinner: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100px', // Fixed height for bottom spinner
    },
    jobCard: {
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: theme.color.darkGrey,
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
      border: `1px solid ${theme.color.secondary}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    },
    jobTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: theme.color.text,
    },
    jobDescription: {
      fontSize: '14px',
      color: theme.color.text,
      marginBottom: '5px',
    },
    applyButton: {
      alignSelf: 'flex-start',
      padding: '10px 20px',
      borderRadius: '5px',
      backgroundColor: theme.color.pink,
      color: '#fff',
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      transition: 'background-color 0.2s',
    },
    buttonText: {
      color: theme.color.primary,
    },
    applyButtonHover: {
      backgroundColor: theme.color.secondary,
    },
    jobCardHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    },

    // **Styles for Skills Filter**
    skillOptions: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '6px',
      maxHeight: '370px', // Optional: Set max height to prevent excessive scrolling
      overflowY: 'auto',
    },
    skillButton: {
      padding: '5px 8px', // Smaller padding for skills buttons
      borderRadius: '15px',
      backgroundColor: theme.color.secondary,
      color: '#fff',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px', // Smaller font size
      transition: 'background-color 0.2s, transform 0.2s',
    },
    skillButtonSelected: {
      backgroundColor: theme.color.pink,
      transform: 'scale(1.05)', // Slight scale effect for selected filters
    },
  };

  return styles;
};

export default useStyles;
