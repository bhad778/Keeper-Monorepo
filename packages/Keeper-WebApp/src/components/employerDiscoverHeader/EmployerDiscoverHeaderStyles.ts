import { employerDiscoverHeaderHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = (selectedJobColor: string, doesEmployerHaveAnyJobs: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      height: doesEmployerHaveAnyJobs ? employerDiscoverHeaderHeight : 65,
      width: '100vw',
      alignItems: 'center',
      justifyContent: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: doesEmployerHaveAnyJobs ? 0 : 20,
    },
    modalStyles: {
      backgroundColor: theme.color.primary,
      height: 300,
    },
    title: {
      color: theme.color.primary,
      fontSize: 55,
      marginRight: 20,
    },
    subTitleContainer: {
      display: doesEmployerHaveAnyJobs ? 'flex' : 'none',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: selectedJobColor || theme.color.primary,
      width: '100%',
    },
    subTitle: {
      fontSize: 18,
      color: theme.color.primary,
      marginRight: 10,
      bottom: 0,
      position: 'relative',
    },
    horizontalFilterScroll: {
      display: 'flex',
      flexWrap: 'wrap',
      position: 'relative',
      paddingTop: 10,
    },
    dropdown: {},
    text: {
      color: theme.color.primary,
    },
    chipContainerStyles: {
      backgroundColor: theme.color.primary,
      borderColor: theme.color.white,
      borderWidth: 1,
      height: 40,
    },
    lastChip: {
      marginRight: 30,
    },
    chipTextStyles: {
      color: theme.color.white,
      fontSize: 15,
    },
  } as const;

  return styles;
};

export default useStyles;
