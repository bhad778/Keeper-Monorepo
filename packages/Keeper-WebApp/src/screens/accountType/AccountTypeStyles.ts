import { useWindowDimensions } from 'hooks';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isEducationSwiperVisible: boolean) => {
  const { theme } = useTheme();
  const { windowHeight } = useWindowDimensions();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme.color.primary,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'auto',
      height: '100vh',
      width: '100%',
      // if isEducationSwiperVisible change padding to fit small screen, else its 0
      paddingTop: isEducationSwiperVisible ? (windowHeight < 850 ? 200 : 50) : 0,
    },
    titleText: {
      backgroundColor: theme.color.primary,
      color: 'white',
      marginBottom: 30,
      textAlign: 'center',
      lineHeight: 1.3,
    },
    buttonContainer: {},
    loginButtons: {
      width: 350,
      height: 50,
      marginTop: 15,
    },
    loginButtonText: {
      fontSize: 22,
    },
    haveAccountText: {
      fontSize: 20,
      marginTop: 30,
      color: 'white',
    },
    loginText: {
      fontSize: 25,
      marginTop: 5,
      textDecoration: 'none',
      borderBottom: `${theme.color.white} solid 2px`,
      color: 'white',
    },
  } as const;

  return styles;
};

export default useStyles;
