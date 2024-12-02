import { useTheme } from 'theme/theme.context';

export const useStyles = (isEditJobModalOpen: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      backgroundColor: theme.color.primary,
      position: 'relative',
      top: isEditJobModalOpen ? 35 : 0,
    },
    menuListText: {
      color: 'white',
    },
    modalRowItem: {
      // borderBottom: '1px solid white',
    },
    jobMenuModal: {
      width: '25%',
    },
    employersJobsContainer: {
      height: '100vh',
      overflow: 'auto',
      paddingLeft: 40,
      paddingRight: 40,
      paddingBottom: 50,
    },
    createNewJobButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginBottom: 20,
    },
    createNewJobButton: {
      width: 200,
    },
    discoverContainer: {
      height: '100%',
    },
    backArrow: {
      position: 'absolute',
      zIndex: 1,
    },
    addJobTextContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 40,
      marginBottom: 15,
      display: 'flex',
    },
    plusIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },

    addNewJobText: {
      color: theme.color.text,
      fontSize: 20,
      paddingLeft: 4,
      paddingTop: 4,
    },
    forwardIcon: {
      color: theme.color.white,
    },
    noJobsTextContainer: {
      height: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      marginTop: 20,
      flexDirection: 'column',
      textAlign: 'center',
    },
    arrowUpwardIcon: {
      color: theme.color.white,
      fontSize: 60,
    },
    noJobsText: {
      width: '50%',
    },
  } as const;

  return styles;
};

export default useStyles;
