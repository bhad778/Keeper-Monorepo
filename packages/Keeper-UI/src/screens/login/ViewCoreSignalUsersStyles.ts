import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (matchesLength: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flex: 1,
      backgroundColor: theme.color.primary,
      position: 'relative',
      paddingTop: matchesLength > 2 ? 60 : 120,
    },
    scrollView: {
      backgroundColor: theme.color.primary,
      width: '100%',
    },
    matchesContainer: {
      alignItems: 'center',
      flex: 1,
      backgroundColor: theme.color.primary,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      columnGap: matchesLength === 2 ? 7 : undefined,
      paddingTop: matchesLength > 2 ? 10 : 80,
    },
    headerText: {
      color: theme.color.white,
      fontSize: 35,
      marginBottom: 20,
      textAlign: 'center',
    },
    bottomTextContainer: {
      position: 'absolute',
      bottom: 100,
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bottomText: {
      color: theme.color.white,
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 25,
      textDecorationLine: 'underline',
      width: '80%',
    },
    dontSeeProfileText: {
      color: theme.color.white,
      fontSize: 16,
      textAlign: 'center',
    },
  });
  return styles;
};

export default useStyles;
