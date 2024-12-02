import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    scrollView: {
      alignItems: 'center',
      paddingHorizontal: 20,
      marginTop: 40,
      paddingBottom: 100,
    },
    menuListItem: {
      borderBottomWidth: 1,
      height: 60,
      justifyContent: 'center',
      width: '90%',
    },
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    menuListText: {
      fontSize: 20,
      color: 'black',
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 20,
      alignSelf: 'flex-end',
    },
    addResponsibilityButton: {
      flexDirection: 'row',
      width: '100%',
      borderWidth: 2,
      borderRadius: 30,
      height: 65,
      padding: 15,
      marginBottom: 20,
      borderColor: theme.color.white,
      justifyContent: 'center',
      alignItems: 'center',
    },
    ellipsis: {
      position: 'absolute',
      top: 45,
      right: 0,
      zIndex: 2,
    },
    textAreasContainer: {
      width: '100%',
      marginBottom: 5,
    },
    topText: {
      color: theme.color.text,
      fontSize: 21,
      marginBottom: 40,
    },
    text: {
      color: theme.color.text,
      fontSize: 21,
    },
    textAreas: {
      padding: 15,
      height: 130,
      borderRadius: 20,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      paddingRight: 30,
      zIndex: 1,
      marginBottom: 20,
    },
    removeResponsibilityButton: {
      borderWidth: theme.general.borderWidth,
      borderRadius: 25,
      borderColor: '#dadada',
      height: 35,
      width: 35,
      position: 'absolute',
      right: -10,
      top: -15,
      zIndex: 2,
      justifyContent: 'center',
      backgroundColor: 'white',
      alignItems: 'center',
    },
  });
  return styles;
};

export default useStyles;
