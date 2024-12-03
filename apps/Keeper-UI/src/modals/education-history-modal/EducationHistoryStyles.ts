import { useTheme } from 'theme/theme.context';
import { Dimensions, StyleSheet } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

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
      marginTop: 20,
      // minus 2 because it has to be slightly smaller than perfect
      // width or else you can scroll horizontally
      width: SCREEN_WIDTH - padding * 2 - 2,
      height: SCREEN_HEIGHT,
    },
    preferenceItem: {
      paddingBottom: 20,
      borderBottomWidth: 1.5,
      borderBottomColor: theme.color.white,
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
    addItemButton: {
      width: '98%',
      height: 60,
      borderWidth: theme.general.borderWidth,
      marginTop: 30,
    },
    addItemButtonText: {
      fontSize: 20,
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 5,
      alignSelf: 'flex-end',
    },
    openItemIcon: {
      position: 'absolute',
      right: 0,
      top: 27,
    },
  });

  return styles;
};

export default useStyles;
