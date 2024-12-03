import { Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export const useStyles = (usersThatLikedYouLength: number) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    customChannelListWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      display: 'flex',
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: usersThatLikedYouLength > 0 ? 30 : 0,
    },
    matchContainer: {
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: 35,
      left: 10,
    },
    customChannelList: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      columnGap: usersThatLikedYouLength === 2 ? 7 : undefined,
    },
    topOfBlankListItem: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      flex: 1,
    },
    bottomOfBlankListItem: {
      height: '25%',
      borderTop: `${theme.color.white} solid 1.5px`,
      padding: 20,
    },
    blankChannelListItem: {
      width: SCREEN_WIDTH * 0.45,
      height: 230,
      marginBottom: 10,
      borderRadius: 20,
      backgroundColor: theme.color.darkGrey,
    },
    modalStyles: {
      backgroundColor: theme.color.primary,
      margin: 0,
      height: SCREEN_HEIGHT,
      width: SCREEN_WIDTH,
      padding: 0,
      border: 'none',
      left: -20,
      overflow: 'scroll',
    },
    heartIcon: {
      color: 'white',
      position: 'absolute',
      zIndex: 1,
      bottom: 0,
      left: 91,
      fontSize: '2.5rem',
    },
    xOrNextButtonContainer: {
      height: 80,
      width: '100%',
      position: 'absolute',
      bottom: 20,
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingHorizontal: 15,
      flexDirection: 'row',
    },
    browseNextButton: {
      shadowColor: 'rgba(0, 0, 0, 0.3)',
      shadowOpacity: 1,
      elevation: 6,
      shadowRadius: 30,
      shadowOffset: { width: 1, height: 13 },
      width: 110,
      height: 55,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 100,
      backgroundColor: theme.color.pink,
      flexDirection: 'row',
      paddingHorizontal: 15,
    },
    browseNextText: {
      color: theme.color.black,
      fontSize: 19,
    },
  } as const;

  return styles;
};

export default useStyles;
