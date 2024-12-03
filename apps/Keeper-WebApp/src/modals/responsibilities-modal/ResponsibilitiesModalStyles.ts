import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const deleteButtonSize = 24;

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
      display: 'flex',
      zIndex: 1,
      flexDirection: 'column',
      flexGrow: 1,
      height: '75vh',
      padding: 0,
    },
    topContentsContainer: {
      padding: 30,
      paddingTop: 45,
    },
    yourAFitItemsContainer: {
      overflow: 'auto',
      paddingTop: 20,
      paddingLeft: 30,
      paddingRight: 30,
    },
    addToListButton: {
      marginBottom: 10,
    },
    yourAFitIfText: {
      color: 'white',
      fontSize: 24,
    },
    scrollView: {
      alignItems: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      marginTop: 40,
      paddingBottom: 100,
    },
    menuListItem: {
      borderBottomWidth: 1,
      height: 60,
      justifyContent: 'center',
      width: '90%',
    },
    deleteButtonStyles: {
      backgroundColor: theme.color.white,
      width: deleteButtonSize,
      height: deleteButtonSize,
      display: 'flex',
      right: -15,
      top: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
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
      position: 'relative',
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
      overflow: 'unset',
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
  } as const;
  return styles;
};

export default useStyles;
