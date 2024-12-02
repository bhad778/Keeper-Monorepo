import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (titleLength: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginTop: Platform.OS === 'ios' ? 40 : 0,
      height: 100,
      borderBottomWidth: 2,
      borderBottomColor: theme.color.white,
      width: '100%',
      borderColor: theme.color.white,
      backgroundColor: theme.color.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 13,
    },
    title: {
      fontSize: titleLength > 13 ? 23 : 30,
      color: theme.color.white,
    },
    jobBoardHeader: {
      height: 60,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 40,
      backgroundColor: theme.color.primary,
      borderWidth: 2,
      borderColor: theme.color.white,
    },
    backButtonContainer: {
      position: 'absolute',
      left: 25,
    },
    backIconStyles: {
      // height: theme.general.backIconSize,
      // width: theme.general.backIconSize,
    },
    cogIconStyles: {
      height: 25,
      width: 25,
    },
    rightIconTouchable: {
      position: 'absolute',
      right: 17,
    },
  });

  return styles;
};

export default useStyles;
