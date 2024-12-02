import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      width: '100%',
      marginBottom: 10,
    },
    text: {
      color: theme.color.white,
      fontSize: 28,
    },
  } as const;

  return styles;
};

export default useStyles;
