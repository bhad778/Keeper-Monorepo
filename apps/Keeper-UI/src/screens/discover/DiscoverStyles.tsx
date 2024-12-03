import { bottomTabNavigatorBaseHeight } from 'constants/globalConstants';
import { StyleSheet, Dimensions, Animated } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (
  wholeSwiperFadeAnim: Animated.Value,
  wholeSwiperTranslateY: Animated.Value,
  xIconFadeAnim: Animated.Value,
  xIconScale: Animated.Value,
  xIconTranslateYValue: Animated.Value,
  top: Animated.Value,
  isEmployee: boolean,
  likeDislikeIconWidth: number,
  isNew?: boolean,
) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.primary,
    },
    ranOutOfLikesText: {
      marginBottom: 20,
      width: '90%',
      fontSize: 20,
      lineHeight: 25,
    },
    animationSvg: {
      height: 300,
      width: 300,
    },
    cantSwipeModal: {
      padding: 32,
    },
    cantSwipeText: {
      fontSize: 26,
    },
    jobBoardAnimatedView: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      zIndex: 100,
      transform: [{ translateY: top }],
    },
    noMoreLeftContainer: {
      paddingHorizontal: 20,
    },
    emptyHeader: {
      backgroundColor: theme.color.primary,
    },
    noMoreLeftText: {
      fontSize: 20,
      top: 30,
      paddingBottom: 20,
      color: theme.color.white,
    },
    selectAccountTypeButton: {
      top: 140,
      width: undefined,
    },
    xIcon: {
      position: 'absolute',
      // SCREEN_WIDTH / 2 to get it half way horizontally, but that means left side starts half way
      // so you need to do likeDislikeIconWidth / 2 so the middle starts half way
      left: SCREEN_WIDTH / 2 - likeDislikeIconWidth / 2 + 15,
      // top: SCREEN_HEIGHT / 2 - 39 / 2 - 80,
      top: SCREEN_HEIGHT / 2 - 39 / 2 - bottomTabNavigatorBaseHeight,
      zIndex: 1,
      color: 'white',
    },
    likeDislikeIcon: {
      position: 'absolute',
      left: SCREEN_WIDTH / 2 - likeDislikeIconWidth / 2,
      // top: SCREEN_HEIGHT / 2 - 39 / 2 - 80,
      top: SCREEN_HEIGHT / 2 - 39 / 2 - bottomTabNavigatorBaseHeight,
      zIndex: 1,
      color: 'white',
    },
    addBasicInfoSection: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    addBasicInfoContainer: {
      justifyContent: 'center',
      marginTop: 100,
    },
    leftIconTouchable: {
      height: '100%',
      width: '100%',
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    backIcon: {
      height: theme.general.backIconSize,
      width: theme.general.backIconSize,
      resizeMode: 'contain',
    },
    headerTitle: {
      color: theme.color.white,
    },
    swipingCardsAnimatedView: {
      opacity: wholeSwiperFadeAnim,
      transform: [
        {
          translateY: wholeSwiperTranslateY.interpolate({
            inputRange: [0, 1],
            outputRange: [0, SCREEN_HEIGHT],
          }),
        },
      ],
    },
    xIconAnimatedImage: {
      opacity: xIconFadeAnim, // Bind opacity to animated value
      transform: [
        {
          scale: xIconScale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 2.2],
          }),
        },

        {
          translateY: xIconTranslateYValue,
        },
      ],
    },
  });
  return styles;
};

export default useStyles;
