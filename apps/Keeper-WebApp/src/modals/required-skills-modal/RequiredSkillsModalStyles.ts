import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      margin: 0,
      backgroundColor: theme.color.primary,
      overflow: 'auto',
    },
    chipsPickerContainer: {
      paddingTop: 30,
    },
    container: {
      // paddingLeft: 20,
      // paddingRight: 20,
      paddingTop: 20,
      height: '100%',
    },
    checkboxContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
      marginBottom: 30,
    },
    currentlyEmployedText: {
      color: theme.color.white,
    },
    headerStyles: {
      marginTop: 100,
    },
    maxCountText: {
      color: theme.color.text,
      fontSize: 25,
      textAlign: 'center',
      paddingBottom: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
