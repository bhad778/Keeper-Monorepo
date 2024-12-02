import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    containerStyles: {
      height: 70,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.primary,
      width: '100%',
      zIndex: 1,
    },
  } as const;

  return styles;
};

export default useStyles;
