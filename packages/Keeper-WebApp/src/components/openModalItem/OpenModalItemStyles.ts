import { useTheme } from 'theme/theme.context';

export const useStyles = (isError?: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      borderBottomColor: isError ? theme.color.alert : 'white',
      borderBottomWidth: theme.general.borderWidth,
      borderBottomStyle: 'solid',
      width: '100%',
      maxWidth: '100%',
      display: 'flex',
    },
    upRightArrowContainer: {
      height: '100%',
      width: 15,
    },
    titleSection: {
      paddingTop: 20,
    },
    arrowContainer: {
      paddingTop: 2,
      position: 'relative',
      top: 6,
    },
    titleText: {
      color: theme.color.white,
      verticalAlign: 'top',
      lineHeight: 1,
    },
    ellipsis: {
      fontSize: 20,
      color: '#999999',
    },
    upRightArrow: {
      color: 'white',
      height: 18,
      width: 15,
      marginTop: 22,
    },
    valuesSection: {
      paddingLeft: 10,
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      display: 'flex',
    },
    valuesContainer: {
      color: theme.color.secondary,
      display: 'inline-block',
      width: '99%',
      maxWidth: '99%',
      whiteSpace: 'nowrap',
      lineHeight: 1,
      textAlign: 'left',
      paddingRight: 10,
      paddingBottom: 2,
      fontSize: 20,
    },
    locationAndArrowSection: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    valuesText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 12,
      color: theme.color.secondary,
    },
    circleContainer: {
      marginRight: 8,
      marginLeft: 8,
    },
    circle: {
      color: '#999999',
      fontSize: 9,
      paddingTop: 7,
      display: 'flex',
    },
  } as const;

  return styles;
};

export default useStyles;
