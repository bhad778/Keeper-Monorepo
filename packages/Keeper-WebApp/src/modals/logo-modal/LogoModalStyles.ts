import { useTheme } from 'theme/theme.context';

export const useStyles = (logo: string | undefined, isError?: boolean, isJobPosting?: boolean, maxHeight?: string) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    imageSelectorSection: {
      width: '100%',
      marginBottom: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      overflow: logo ? 'visible' : 'hidden',
      position: 'relative',
      top: 15,
      alignItems: 'center',
      minHeight: 400,
      borderRadius: 10,
      border: !logo ? 'solid white 1px' : '',
    },
    logoImage: {
      borderRadius: isJobPosting ? 0 : 40,
      width: '93%',
      marginBottom: 10,
      maxHeight: maxHeight || '43vh',
    },
    profileImgPlaceholder: {
      borderRadius: isJobPosting ? 0 : 40,
      width: '93%',
      marginBottom: 10,
      maxHeight: maxHeight || '43vh',
    },
    emptyCompanyLogoContainer: {
      borderRadius: isJobPosting ? 0 : 70,
      width: '93%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 300,
      marginBottom: 10,
      maxHeight: '43vh',
    },
    companyLogoText: {
      color: theme.color.white,
      bottom: 50,
      fontSize: 40,
      width: '80%',
      textAlign: 'center',
    },
    logoButtonContainer: {
      position: 'absolute',
      bottom: 20,
    },
    chooseLogoButton: {
      backgroundColor: isError ? theme.color.alert : theme.color.white,
      borderRadius: 99,
      height: 70,
      width: 70,
    },
  } as const;

  return styles;
};

export default useStyles;
