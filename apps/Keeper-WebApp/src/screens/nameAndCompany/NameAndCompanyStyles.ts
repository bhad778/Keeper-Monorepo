import { useTheme } from 'theme/theme.context';

export const useStyles = (isValid: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      width: '100%',
      overflow: 'scroll',
      height: theme.spacing.screenHeightWithNavbar,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    textInputHeader: {
      textAlign: 'center',
      fontSize: 25,
    },
    titleText: {
      bottom: 200,
      position: 'relative',
    },
    textInputStyles: {
      textAlign: 'center',
    },
    textInputContainer: {
      width: 400,
    },
    submitButton: {
      backgroundColor: isValid ? theme.color.pink : theme.color.primary,
      padding: 15,
    },
    submitButtonText: {
      color: isValid ? theme.color.primary : theme.color.white,
      fontSize: 25,
    },
    bottomTextContainer: {
      position: 'absolute',
      bottom: 50,
    },
    bottomText: {
      color: theme.color.white,
      fontSize: 16,
      textAlign: 'center',
      textDecoration: 'underline',
    },
  } as const;

  return styles;
};

export default useStyles;
