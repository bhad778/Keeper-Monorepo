import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (backgroundColor: string, titleLength: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    appBarHeader: {
      backgroundColor,
      width: SCREEN_WIDTH,
      height: 80,
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 0,
    },
    leftSection: {
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
      marginBottom: 2,
    },
    middleSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightSection: {
      width: 80,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      textTransform: 'capitalize',
      color: 'black',
      fontSize: titleLength > 11 ? 28 : 35,
      lineHeight: titleLength > 11 ? 30 : 40,
      marginTop: 2,
    },
  });
  return styles;
};

export default useStyles;
