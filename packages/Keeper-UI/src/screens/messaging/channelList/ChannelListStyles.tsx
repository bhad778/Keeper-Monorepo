import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (matchesLength: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    customChannelListWrapper: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      display: 'flex',
    },
    customChannelList: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      columnGap: matchesLength === 2 ? 7 : undefined,
    },
    blankChannelListItem: {
      width: SCREEN_WIDTH * 0.45,
      height: 230,
      marginBottom: 10,
      borderRadius: 20,
      backgroundColor: theme.color.darkGrey,
    },
  });

  return styles;
};

export default useStyles;
