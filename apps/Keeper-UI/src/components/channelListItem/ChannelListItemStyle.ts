import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (isCandidateSort: boolean, isEmployee: boolean, color?: string, isNewMatch?: boolean) => {
  const { theme } = useTheme();

  const borderRadius = 20;

  const styles = StyleSheet.create({
    channelListItem: {
      width: isCandidateSort ? SCREEN_WIDTH * 0.45 : SCREEN_WIDTH * 0.42,
      marginBottom: 10,
      borderRadius,
      backgroundColor: isCandidateSort ? color : 'transparent',
    },
    contents: {
      // opacity: isNewMatch ? 0.3 : 1,
    },
    newMatchTextContainer: {
      position: 'absolute',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      top: 35,
      zIndex: 1,
    },
    newMatchText: {
      fontSize: 30,
      lineHeight: 40,
      textAlign: 'center',
      fontWeight: 'bold',
      width: '60%',
    },
    avatar: {
      height: isEmployee ? 140 : 180,
      width: '100%',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      borderBottomLeftRadius: isCandidateSort ? 0 : 20,
      borderBottomRightRadius: isCandidateSort ? 0 : 20,
      // backgroundColor: isNewMatch ? color : 'white',
      // opacity: isNewMatch ? 0.3 : 1,

      backgroundColor: isNewMatch ? color : 'white',
      opacity: isNewMatch ? 0.3 : 1,
    },
    channelTextContainer: {
      width: '100%',
      height: isEmployee ? 120 : 85,
      alignItems: 'flex-start',
      paddingHorizontal: 10,
      paddingTop: 15,
      paddingBottom: 15,
      backgroundColor: color,
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
    },
    channelTitle: {
      fontSize: 24,
      lineHeight: 25,
      textTransform: 'capitalize',
    },
    channelText: {
      fontSize: 12,
      minHeight: 33,
      lineHeight: 14,
      color: 'black',
      paddingTop: 10,

      // position: 'absolute',
      // bottom: 15,
      // left: 10,
    },
    redCircle: {
      width: 16,
      height: 16,
      zIndex: 1,
      backgroundColor: 'red',
      borderRadius: 50,
      position: 'absolute',
      right: 8,
      top: 8,
    },
  });

  return styles;
};

export default useStyles;
