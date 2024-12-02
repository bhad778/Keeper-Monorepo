import { StyleSheet, Animated } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (jobColor: string, height: Animated.Value, jobTitleLength: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    jobsMatchesContainer: {
      borderRadius: 30,
      backgroundColor: jobColor,
      height,
      width: '100%',
      paddingHorizontal: 10,
      paddingTop: 18,
    },
    titleAndCompanyTouchable: {
      height: 100,
      width: '100%',
      paddingTop: 5,
      paddingHorizontal: 20,
      marginBottom: 50,
    },
    jobTitle: {
      fontSize: 40,
      lineHeight: 46,
      textTransform: 'capitalize',
      flexWrap: 'wrap',
      paddingRight: 10,
    },
    companyName: {
      paddingLeft: 3,
      textTransform: 'capitalize',
      fontSize: 23,
    },
    emptyMatchesText: {
      paddingLeft: 22,
      fontSize: 20,
      width: '70%',
      paddingTop: 20,
      color: 'black',
    },
    arrowSvg: {
      width: 15,
      height: 15,
      position: 'absolute',
      right: 10,
      top: 12,
    },
  });
  return styles;
};

export default useStyles;
