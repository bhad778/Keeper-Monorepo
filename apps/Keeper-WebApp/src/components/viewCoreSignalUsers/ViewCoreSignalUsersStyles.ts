import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      width: '100%',
      overflow: 'scroll',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      paddingTop: 80,
    },
    headerText: {
      color: theme.color.white,
      fontSize: 35,
      marginBottom: 20,
      textAlign: 'center',
    },
    matchesContainer: {
      display: 'flex',
      flex: 1,
      backgroundColor: theme.color.primary,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      columnGap: 30,
      width: '100%',
      paddingTop: 50,
    },
    bottomTextContainer: {
      position: 'absolute',
      bottom: 50,
    },
    bottomText: {
      color: theme.color.white,
      fontSize: 16,
      textAlign: 'center',
      textDecoration: 'underline',
    },
    dontSeeProfileText: {
      color: theme.color.white,
      fontSize: 16,
      textAlign: 'center',
    },
  } as const;

  return styles;
};

export default useStyles;
