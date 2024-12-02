import { useTheme } from 'theme/theme.context';

export const useStyles = (backgroundColor?: string) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    loadingScreenContainer: {
      backgroundColor: backgroundColor || theme.color.primary,
      minWidth: '100%',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  } as const;

  return styles;
};

export default useStyles;
