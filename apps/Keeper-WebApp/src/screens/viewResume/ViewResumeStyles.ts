import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme.color.primary,
      width: '100%',
      height: '100%',
    },
    backButtonIcon: {
      color: 'white',
    },
  } as const;

  return styles;
};

export default useStyles;
