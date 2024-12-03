import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    educationTypeContainer: {
      flex: 5,
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.color.primary,
    },
    buttonsContainer: {
      width: '100%',
      marginTop: 60,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
  } as const;

  return styles;
};

export default useStyles;
