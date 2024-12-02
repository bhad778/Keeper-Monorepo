import { useWindowDimensions } from 'hooks';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();
  const { windowHeight } = useWindowDimensions();

  const styles: { [k: string]: React.CSSProperties } = {
    mobileStepper: {
      backgroundColor: theme.color.primary,
      marginTop: 20,
    },
    swiperContainer: {
      maxWidth: 400,
      flexGrow: 1,
      minWidth: 400,
      marginTop: windowHeight < 850 ? '100px' : 0,
      marginBottom: windowHeight < 850 ? '100px' : 0,
    },
    imgContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideText: {
      fontSize: 20,
      color: 'white',
      paddingTop: 50,
      marginBottom: 50,
      textAlign: 'center',
    },
    finishButtons: {
      width: '80%',
      marginBottom: 15,
    },
    img: {
      height: 500,
      display: 'block',
      overflow: 'hidden',
      marginBottom: 4,
    },
    finalButtonsContainer: {
      height: 480,
      overflow: 'hidden',
      marginBottom: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  } as const;

  return styles;
};

export default useStyles;
