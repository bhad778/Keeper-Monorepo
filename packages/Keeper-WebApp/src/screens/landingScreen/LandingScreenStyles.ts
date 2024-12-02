import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    landingScreenContainer: {
      backgroundColor: theme.color.primary,
      minWidth: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  } as const;

  return styles;
};

export default useStyles;
