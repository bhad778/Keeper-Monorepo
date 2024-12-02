import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const deleteButtonSize = 25;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
      display: 'flex',
      zIndex: 1,
      flexDirection: 'column',
      flexGrow: 1,
      padding: 0,
    },
    contents: {
      flex: 1,
      paddingTop: 40,
      alignItems: 'center',
      backgroundColor: theme.color.primary,
    },
    topContentsContainer: {
      alignItems: 'center',
      flex: 1,
    },
    yourAFitItemsContainer: {
      height: '50%',
      paddingTop: 15,
      paddingBottom: 50,
      backgroundColor: theme.color.primary,
      paddingLeft: 10,
      paddingRight: 10,
    },
    addToListButton: {
      marginTop: 10,
      marginBottom: 30,
      width: '70%',
    },
    yourAFitIfText: {
      color: 'white',
      fontSize: 24,
    },
    scrollView: {
      alignItems: 'center',
      marginTop: 40,
      paddingBottom: 100,
    },
    menuListItem: {
      borderBottomWidth: 1,
      height: 60,
      justifyContent: 'center',
      width: '100%',
    },
    deleteButtonStyles: {
      backgroundColor: theme.color.white,
      width: deleteButtonSize,
      height: deleteButtonSize,
      display: 'flex',
      right: -10,
      top: -15,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 1,
      paddingLeft: 1,
      borderRadius: 100,
      position: 'absolute',
    },
    xIcon: {
      width: '100%',
      height: '100%',
    },
    rightArrow: {
      width: 10,
      height: 10,
      color: theme.color.white,
      position: 'absolute',
      left: -15,
      top: 20,
    },
    keeperTextInputContainer: {
      zIndex: 200,
      width: '100%',
      paddingTop: 5,
      marginBottom: 40,
      borderWidth: 1,
      borderColor: theme.color.white,
      borderRadius: theme.general.borderRadius,
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
      textAlign: 'center',
      paddingLeft: 30,
      paddingRight: 30,
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
