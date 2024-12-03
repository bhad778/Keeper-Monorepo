import { useTheme } from 'theme/theme.context';

export const useStyles = (
  isWhite: boolean,
  isSmallScreen: boolean,
  jobHistoryLength: number,
  shouldTextBeWhite: boolean,
  index: number,
  isComplete?: boolean
) => {
  const { theme } = useTheme();
  const styles: { [k: string]: React.CSSProperties } = {
    noBottomBorder: {
      borderBottomWidth: 0,
    },
    hitSlop: {
      left: 30,
      right: 30,
    },
    jobDetailsSection: {
      display: 'flex',
      flexDirection: 'column',
      borderBottomWidth: index === jobHistoryLength - 1 ? 0 : 2,
      borderBottomStyle: 'solid',
      borderBottomColor: theme.color.white,
    },
    arrow: {
      height: 15,
      width: 15,
    },
    forwardIcon: {
      paddingTop: 7,
      width: 15,
      color: theme.color.white,
    },
    jobTitleText: {
      marginBottom: 0,
      color: isComplete ? theme.color.white : theme.color.alert,
      lineHeight: 1.2,
    },
    companyContainer: {
      display: 'flex',
    },
    jobNumberContainer: {
      paddingTop: 10,
    },
    companyText: {
      fontSize: 14,
      marginBottom: 10,
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    subHeaderContainerStyles: {
      marginBottom: 0,
      maxWidth: '60%',
    },
    jobTitleContainerStyles: {
      flex: 1,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingTop: 10,
      paddingRight: 20,
    },
    jobMonthsText: {
      fontSize: 16,
      textWrap: 'nowrap',
      paddingLeft: 10,
      justifySelf: 'flex-end',
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    hidden: {
      display: 'none',
    },
    jobNumber: {
      width: 30,
      display: 'flex',
      alignItems: 'flex-end',
      color: isComplete ? theme.color.white : theme.color.alert,
    },
    jobDetailsOpened: {
      display: 'flex',
      paddingBottom: 10,
      color: theme.color.white,
      whiteSpace: 'pre-line',
      fontSize: 17,
    },
    companyName: {
      marginTop: 12,
      marginBottom: -3,
      color: isComplete ? 'white' : theme.color.alert,
    },
  } as const;

  return styles;
};

export default useStyles;
