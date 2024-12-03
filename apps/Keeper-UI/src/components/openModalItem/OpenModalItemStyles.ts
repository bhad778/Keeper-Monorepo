import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isError: boolean, location: boolean) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      borderBottomColor: isError ? theme.color.alert : 'white',
      borderBottomWidth: theme.general.borderWidth,
      height: 65,
      marginVertical: 5,
    },
    titleAndIconSection: {
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    titleText: {
      color: theme.color.white,
      fontSize: 19,
    },
    upRightArrow: {
      color: 'white',
      height: 12,
      width: 12,
      resizeMode: 'contain',
      position: 'absolute',
      top: 10,
      right: 3,
    },
    valuesSection: {
      width: '100%',
      flex: 1,
      paddingLeft: location ? 5 : 'auto',
    },
    valuesContainer: {
      // marginTop: 2,
      width: '95%',
      color: theme.color.secondary,
    },
    valuesText: {
      color: '#999999',
    },
    circleContainer: {},
    circle: {
      color: '#999999',
      fontSize: 9,
      paddingTop: 3,
      display: Platform.OS === 'ios' ? 'flex' : 'none',
    },
  });

  return styles;
};

export default useStyles;
