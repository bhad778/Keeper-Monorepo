import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
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
    title: {
      fontSize: '14px',
      color: theme.color.secondary,
      marginBottom: '5px',
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
      marginTop: '10px',
      width: '100%',
    },
    buttonText: {
      color: theme.color.primary,
    },
    disabledButton: {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    spinnerContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
    loadingText: {
      fontSize: '14px',
      color: theme.color.primary,
    },
  } as const;

  return styles;
};

export default useStyles;
