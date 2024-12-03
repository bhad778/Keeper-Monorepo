import { useTheme } from 'theme/theme.context';

export const useStyles = (isCandidateSort: boolean, color?: string, isEmployee?: boolean, isNewMatch?: boolean) => {
  const { theme } = useTheme();

  const borderRadius = 20;

  const styles: { [k: string]: React.CSSProperties } = {
    channelListItem: {
      borderRadius,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: isCandidateSort ? color : 'transparent',
      cursor: 'pointer',
      width: 220,
      height: isEmployee ? 300 : 335,
      position: 'relative',
    },
    contents: {
      width: '100%',
      height: '100%',
    },
    newMatchTextContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      top: 80,
      textAlign: 'center',
      left: 23,
      lineHeight: 1,
      zIndex: 1,
    },
    newMatchText: {
      fontSize: 30,
      textAlign: 'center',
      fontWeight: 'bold',
      width: '60%',
      textWrap: 'wrap',
    },
    avatar: {
      height: isEmployee ? '55%' : '64%',
      width: '100%',
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      borderBottomLeftRadius: isCandidateSort ? 0 : 20,
      borderBottomRightRadius: isCandidateSort ? 0 : 20,
      opacity: isNewMatch ? 0.3 : 1,
    },
    channelTextContainer: {
      alignItems: 'flex-start',
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 5,
      paddingBottom: 15,
      backgroundColor: color,
      borderBottomLeftRadius: borderRadius,
      borderBottomRightRadius: borderRadius,
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
    },
    channelTitle: {
      fontSize: 28,
      textTransform: 'capitalize',
      color: theme.color.black,
      lineHeight: '30px',
      marginBottom: 7,
    },
    channelText: {
      fontSize: 13,
      color: theme.color.black,
    },
    redCircle: {
      zIndex: 1,
      position: 'absolute',
      right: 8,
      top: 8,
    },
  };

  return styles;
};

export default useStyles;
