import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: theme.color.primary,
    },

    benefitButtonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent: 'center',
      marginTop: 60,
    },
    buttonStyles: { width: '47%' },
    buttonText: {
      fontSize: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
