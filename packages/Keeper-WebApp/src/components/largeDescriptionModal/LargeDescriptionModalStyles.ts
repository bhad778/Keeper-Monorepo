import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      height: '40%',
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    textSection: {
      flex: 6,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.color.primary,
      paddingTop: 40,
    },
    keeperModal: {
      padding: 32,
      maxHeight: 600,
    },
    textInput: {
      color: theme.color.white,
      fontSize: 18,
      backgroundColor: theme.color.primary,
    },
    addPreviousHeader: {
      fontSize: 23,
      marginBottom: 30,
    },
    scrollView: {
      flexGrow: 1,
    },
    menuListItem: {
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 5,
    },
    menuListText: {
      fontSize: 18,
      color: 'black',
    },
    largeDescriptionBubble: {
      width: '100%',
      height: 120,
      backgroundColor: theme.color.primary,
      borderRadius: 17,
      borderColor: 'white',
      borderWidth: theme.general.borderWidth,
      zIndex: 1,
      padding: 10,
    },
  } as const;

  return styles;
};

export default useStyles;
