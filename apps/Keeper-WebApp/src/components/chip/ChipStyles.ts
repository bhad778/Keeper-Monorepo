import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    chip: {
      borderRadius: 19,
      height: 30,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 3,
      marginRight: 3,
      paddingLeft: 15,
      paddingRight: 15,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      border: `1px solid ${theme.color.white}`,
    },
    chipText: {
      color: theme.color.white,
    },
    downIcon: {
      height: 30,
      width: 30,
      position: 'relative',
      left: 8,
      color: theme.color.white,
    },
  } as const;

  return styles;
};

export default useStyles;
