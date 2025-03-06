import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
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
      height: 'fit-content',
    },
    jobCardHover: {
      transform: 'scale(1.02)',
      boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
    },
    logoContainer: {
      width: '50px',
      height: '50px',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '5px',
      overflow: 'hidden',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    companyLogo: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    },
    headerRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
    },
    jobInfo: {
      flex: 1,
    },
    jobTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: theme.color.white,
      marginBottom: '2px',
    },
    companyName: {
      fontSize: '14px',
      color: theme.color.secondary,
      marginBottom: '5px',
    },
    jobDetail: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
      marginTop: '10px',
    },
    jobDescription: {
      fontSize: '14px',
      color: theme.color.white,
      marginBottom: '5px',
    },
    skillsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '5px',
      marginTop: '10px',
    },
    skill: {
      fontSize: '12px',
      padding: '3px 8px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      color: theme.color.white,
    },
    applyButton: {
      alignSelf: 'flex-start',
      padding: '10px 20px',
      borderRadius: '5px',
      backgroundColor: theme.color.pink,
      color: theme.color.primary,
      fontWeight: 'bold',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      textAlign: 'center',
      transition: 'background-color 0.2s',
      marginTop: '10px',
    },
    applyButtonHover: {
      backgroundColor: theme.color.secondary,
    },
  };

  return styles;
};

export default useStyles;
