import { useTheme } from 'theme/theme.context';
import { StyleSheet } from 'react-native';

export const useStyles = (isWhite?: boolean, isComplete?: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    specificPastJob: {
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: 15,
      paddingRight: 5,
    },
    noBottomBorder: {
      borderBottomWidth: 0,
      paddingBottom: 0,
    },
    hitSlop: {
      left: 30,
      right: 30,
    },
    jobDetailsSection: {
      flex: 1,
      display: 'flex',
    },
    arrow: {
      fontSize: theme.general.arrowIconSize,
      color: 'white',
      position: 'absolute',
      top: 5,
      alignSelf: 'flex-end',
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 5,
      alignSelf: 'flex-end',
    },
    jobTitleContainer: {
      display: 'flex',
      width: '90%',
    },
    jobTitleText: {
      fontSize: 22,
      marginBottom: 4,
      lineHeight: 24,
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    companyContainer: {
      display: 'flex',
    },
    companyText: {
      fontSize: 18,
      textTransform: 'capitalize',
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    jobMonthsText: {
      fontSize: 16,
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    hidden: {
      display: 'none',
    },
    jobDetailsOpened: {
      display: 'flex',
      marginTop: 10,
      fontSize: 16,
      paddingBottom: 10,
      color: theme.color.white,
    },
    companyName: {
      marginTop: 12,
      marginBottom: -3,
      fontSize: 20,
      color: theme.color.white,
    },
  });

  return styles;
};

export default useStyles;
