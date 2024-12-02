import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      position: 'relative',
    },
    badge: {
      position: 'absolute',
      top: 0,
      right: -5,
      zIndex: 1,
      backgroundColor: theme.color.alert,
    },
  } as const;

  return styles;
};

export default useStyles;
