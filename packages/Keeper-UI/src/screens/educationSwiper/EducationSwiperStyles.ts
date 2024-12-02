import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    educationSwiperContainer: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
    },
    slideContainer: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      alignItems: 'center',
    },
    fullSlide: {
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    keepButton: {
      width: '90%',
      height: 60,
      display: 'flex',
      flexDirection: 'row',
      borderWidth: theme.general.borderWidth,
    },
    slideTopSection: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.color.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slideImage: {
      height: '80%',
      width: '100%',
      resizeMode: 'contain',
    },
    slideBottomSection: {
      height: 270,
      width: '100%',
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 35,
      paddingBottom: 50,
    },
    finalEmployerText: {
      fontSize: 20,
      textAlign: 'center',
      lineHeight: 25,
      marginBottom: 20,
      color: 'black',
    },
    bottomText: {
      fontSize: 20,
      textAlign: 'center',
      lineHeight: 30,
    },
    bottomButtonsSection: {
      position: 'absolute',
      bottom: 20,
      zIndex: 1,
      paddingHorizontal: 20,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 50,
      width: SCREEN_WIDTH,
    },
    bottomButton: {
      zIndex: 1,
      padding: 8,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: 85,
    },
    bottomNumbers: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    caretIcon: {
      bottom: 1,
    },
  });
  return styles;
};

export default useStyles;
