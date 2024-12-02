import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 1000,
      padding: 40,
      paddingBottom: 0,
    },
    tableBody: {
      backgroundColor: theme.color.darkGrey,
    },
    grey: {
      backgroundColor: 'black',
      opacity: 0.8,
    },
    font: {
      backgroundColor: theme.color.white,
    },
    searchContainer: {
      width: '30%',
    },
    smallTextInputsContainer: {
      width: '100%',
      marginBottom: 20,
      display: 'flex',
      justifyContent: 'space-between',
    },
    addEntryButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: 10,
    },
    addEntryButton: {
      width: '40%',
      backgroundColor: theme.color.pink,
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      borderRadius: 30,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      display: 'flex',
      border: `solid ${theme.color.white}  ${theme.general.borderWidth}px`,
      cursor: 'pointer',
    },
    disabledAddEntryButton: {
      width: '40%',
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      borderRadius: 30,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      display: 'flex',
      backgroundColor: theme.color.primary,
      border: `solid ${theme.color.white}  ${theme.general.borderWidth}px`,
    },
    smallTextContainer: {
      width: '40%',
      paddingLeft: 25,
      paddingRight: 25,
    },
    smallTextInput: {
      display: 'flex',
      flexDirection: 'column',
    },
    addResumeButton: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 40,
      width: '100%',
      borderRadius: 30,
      backgroundColor: theme.color.white,
      borderWidth: theme.general.borderWidth,
      borderColor: theme.color.white,
      display: 'flex',
    },
  } as const;

  return styles;
};

export default useStyles;
