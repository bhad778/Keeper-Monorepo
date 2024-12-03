import { useTheme } from 'theme/theme.context';

export const useStyles = (disabled: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      cursor: disabled ? 'not-allowed' : 'pointer',
    },
  } as const;

  return styles;
};

export default useStyles;
