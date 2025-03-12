import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
      padding: 5,
    },
  } as const;

  return styles;
};

export default useStyles;
