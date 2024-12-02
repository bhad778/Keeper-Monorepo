import { useTheme } from 'theme/theme.context';
import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const padding = 20;

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    contents: {
      padding,
      flex: 1,
      alignItems: 'center',
    },
    scrollView: {
      // minus padding on both sides
      // minus 2 because it has to be slightly smaller than perfect
      // width or else you can scroll horizontally
      width: SCREEN_WIDTH - padding * 2 - 2,
    },
    preferenceItem: {
      minHeight: 80,
      borderBottomWidth: 1,
      borderBottomColor: theme.color.black,
      // width: SCREEN_WIDTH,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    addButtonContainer: {
      minHeight: 80,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
    },
    areYouLooking: {
      color: theme.color.white,
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 40,
    },
    checkBox: {
      margin: 8,
    },
    openItemIcon: {
      position: 'absolute',
      right: 0,
      top: 27,
    },
    addItemButton: {
      width: '98%',
      height: 60,
      borderWidth: theme.general.borderWidth,
      marginTop: 30,
    },
    addItemButtonText: {
      fontSize: 20,
      lineHeight: 30,
    },
    noSkillsText: {
      fontSize: 23,
      color: 'white',
      textAlign: 'center',
      marginVertical: 30,
    },
    errorText: {
      color: theme.color.alert,
    },
  });

  return styles;
};

export default useStyles;
