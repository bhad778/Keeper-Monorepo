import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
    },
    matchesContainer: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 100,
      columnGap: 35,
      rowGap: 35,
    },
  } as const;

  return styles;
};

export default useStyles;
