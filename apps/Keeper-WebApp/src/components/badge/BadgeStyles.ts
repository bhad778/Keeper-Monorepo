import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    badge: {
      height: 12,
      width: 12,
      borderRadius: 999,
      backgroundColor: theme.color.alert,
    },
  } as const;

  return styles;
};

export default useStyles;
