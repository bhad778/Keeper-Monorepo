import { useTheme } from 'theme/theme.context';

export const useStyles = (isAChannelSelected: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    customChannelListWrapper: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 100,
      paddingRight: isAChannelSelected ? 30 : 0,
      columnGap: 35,
      rowGap: 35,
    },
    customChannelList: {
      flex: 1,
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      columnGap: 30,
      rowGap: 30,
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
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: 230,
      height: 330,
      marginBottom: 10,
      borderRadius: 30,
      backgroundColor: theme.color.primary,
      border: `${theme.color.white} solid 1.5px`,
    },
  } as const;

  return styles;
};

export default useStyles;
