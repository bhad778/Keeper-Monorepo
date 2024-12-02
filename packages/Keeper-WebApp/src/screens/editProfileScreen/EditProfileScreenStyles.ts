import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    loginContainer: {
      height: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerContents: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 2,
      paddingTop: 6,
      paddingRight: 150,
    },
    arrowIconContainerRight: {
      paddingRight: 10,
      paddingBottom: 5,
    },
    arrowIconContainerLeft: {
      paddingLeft: 10,
      paddingBottom: 5,
    },
    arrowIcon: {
      height: 15,
    },
    viewProfileText: {
      color: theme.color.black,
      textAlign: 'center',
      verticalAlign: 'center',
    },
    editProfileText: {
      color: theme.color.black,
    },
  } as const;

  return styles;
};

export default useStyles;
