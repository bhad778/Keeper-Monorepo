import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (textColor?: string, isIncomplete?: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    numberText: {
      fontSize: 15,
      color: isIncomplete ? theme.color.alert : textColor || theme.color.white,
    },
    educationMajorText: {
      fontSize: 20,
      lineHeight: 26,
      color: isIncomplete ? theme.color.alert : textColor || theme.color.white,
      textTransform: 'capitalize',
      marginBottom: 5,
    },
    educationDegreeAndSchoolText: {
      color: isIncomplete ? theme.color.alert : textColor || theme.color.white,
      textTransform: 'capitalize',
    },
    educationTextContainer: {
      flexDirection: 'row',
    },
    circle: {
      fontSize: 9,
      color: textColor || theme.color.white,
      top: 3,
    },
  });
  return styles;
};

export default useStyles;
