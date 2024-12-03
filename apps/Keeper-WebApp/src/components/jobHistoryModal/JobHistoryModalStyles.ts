import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      width: 500,
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    contents: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    preferenceItem: {
      minHeight: 80,
      borderBottomWidth: 1,
      borderBottomColor: theme.color.black,
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    addButtonContainer: {
      minHeight: 80,
      display: 'flex',
      paddingTop: 20,
    },
    areYouLooking: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingTop: 5,
      color: theme.color.white,
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkBox: {
      color: 'white',
      marginLeft: 8,
      paddingTop: 10,
    },
    openItemIcon: {
      position: 'absolute',
      right: 0,
      top: 27,
    },
    skillsOpenModalContainer: {
      borderBottomColor: 'white',
      borderBottomWidth: 1,
      paddingTop: 15,
      paddingBottom: 15,
    },
    extraSkillsTitle: {
      fontSize: 30,
    },
    addItemButton: {
      width: '100%',
      margin: 0,
      backgroundColor: theme.color.pink,
    },
    addItemButtonText: {
      color: 'black',
    },
    addJobButtonContainer: {
      width: '30%',
      marginTop: 15,
    },
    noSkillsText: {
      fontSize: 23,
      color: 'white',
      marginTop: 30,
    },
    errorText: {
      color: theme.color.alert,
    },
  } as const;

  return styles;
};

export default useStyles;
