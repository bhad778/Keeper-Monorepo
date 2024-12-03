import { useTheme } from 'theme/theme.context';
import { StyleSheet } from 'react-native';

export const useStyles = (border: number, hasShadow: boolean | undefined) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    headerContents: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 30,
      alignItems: 'center',
      ...(hasShadow ? theme.color.shadow : {}),
    },
    headerContainer: {
      backgroundColor: 'white',
      width: '100%',
      height: 78,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderWidth: border,
      flexDirection: 'row',
    },
    leftSection: {
      height: '100%',
      width: 55,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    openJobBoardSection: {
      height: '100%',
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleSection: {
      height: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 6,
    },
    titleText: {
      fontSize: 20,
    },
    rightButtonSection: {
      height: '100%',
      width: 60,
      display: 'flex',
      justifyContent: 'center',
      alignSelf: 'flex-end',
      alignItems: 'center',
      paddingRight: 10,
    },
  });

  return styles;
};

export default useStyles;
