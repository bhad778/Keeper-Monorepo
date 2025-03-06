import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
    sidebar: {
      width: '25%',
      padding: '20px',
      backgroundColor: theme.color.primary,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
      height: `calc(100vh - ${navBarHeight}px)`,
      overflowY: 'auto', // Makes the sidebar scrollable if content is too tall
    },
    searchBar: {
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid ${theme.color.secondary}`,
      fontSize: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: theme.color.white,
      outline: 'none',
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
      fontSize: '18px',
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
      color: theme.color.white,
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s, transform 0.2s',
    },
    filterButtonSelected: {
      backgroundColor: theme.color.pink,
      transform: 'scale(1.05)', // Slight scale effect for selected filters
    },
    buttonText: {
      color: theme.color.primary,
    },
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
      color: theme.color.white,
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
