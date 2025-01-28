import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.color.primary,
    },
    sidebar: {
      width: '25%',
      padding: '20px',
      backgroundColor: theme.color.secondary,
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
    },
    locationSearch: {
      padding: '10px',
      borderRadius: '5px',
      border: `1px solid white`,
      fontSize: '16px',
    },
    jobGrid: {
      width: '75%',
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '20px',
      overflowY: 'scroll',
    },
    jobCard: {
      padding: '20px',
      borderRadius: '10px',
      backgroundColor: theme.color.keeperGrey,
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    jobTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: theme.color.text,
    },
    jobDescription: {
      fontSize: '14px',
      color: theme.color.text,
    },
  };

  return styles;
};

export default useStyles;
