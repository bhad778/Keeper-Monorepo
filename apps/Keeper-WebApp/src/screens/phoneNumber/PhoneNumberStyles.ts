import { useTheme } from 'theme/theme.context';

export const useStyles = (isPhoneNumberValid: boolean, isVerificationCodeValid: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: theme.spacing.screenHeightWithNavbar,
      width: '100%',
      position: 'relative',
    },
    label: {
      fontSize: 35,
    },
    titleText: {
      top: 70,
      position: 'absolute',
    },
    backIcon: {
      color: theme.color.white,
      position: 'absolute',
      // top: navBarHeight + 20,
    },
    textInputContainer: {
      width: 400,
    },
    submitButton: {
      backgroundColor: isPhoneNumberValid ? theme.color.pink : theme.color.primary,
      padding: 15,
    },
    submitButtonText: {
      color: isPhoneNumberValid ? theme.color.primary : theme.color.white,
      fontSize: 25,
    },
    verificationSubmitButton: {
      backgroundColor: isVerificationCodeValid ? theme.color.pink : theme.color.primary,
      padding: 15,
    },
    verificationSubmitButtonText: {
      color: isVerificationCodeValid ? theme.color.primary : theme.color.white,
      fontSize: 25,
    },
  } as const;

  return styles;
};

export default useStyles;
