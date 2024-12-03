import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      backgroundColor: theme.color.primary,
      // margin: 0,
    },
    searchContainer: {
      alignItems: 'center',
      flex: 1,
    },
    title: {
      color: 'white',
      fontSize: 24,
    },
    contentsContainer: {
      alignItems: 'center',
      flex: 1,
      width: '100%',
      paddingTop: 40,
    },
    textInputContainer: {
      width: '100%',
      // alignItems: 'center',
    },
    cityOptionsButtonsContainer: {
      width: '100%',
      alignItems: 'center',
      border: `${theme.color.white} solid 1.5px`,
      zIndex: 1,
      marginTop: 25,
      height: 200,
      borderRadius: 20,
    },
    cityOptionsButton: {
      zIndex: 1,
      borderBottom: `${theme.color.white} solid 1.5px`,
      width: '100%%',
      height: '33%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      transition: 'background-color 0.3s ease', // Add transition for smooth effect
      '&:hover': {
        backgroundColor: theme.color.white, // Set the hover background color
      },
    } as React.CSSProperties,
    lastCityOptionsButton: {
      zIndex: 1,
      width: '100%',
      height: '33%',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
    },
    cityOptionsButtonText: {
      color: theme.color.white,
      fontSize: 20,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    pointerTip: {
      height: 30,
      width: 30,
      position: 'absolute',
      bottom: 180,
      transform: [{ rotate: '45deg' }],
      backgroundColor: '#f0f0f0',
      zIndex: 2,
    },
    searchRadiusContainer: {
      marginTop: 20,
      width: '80%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    isRemoteButtonsContainer: {
      flexDirection: 'row',
      marginTop: 20,
    },
    onSiteScheduleContainer: {
      flexDirection: 'row',
      marginTop: 10,
      justifyContent: 'center',
      width: '100%',
      marginBottom: 20,
    },
    workSettingsButtons: {
      width: '30%',
    },
    searchRadiusTitle: {
      fontSize: 30,
    },
    searchRadiusValue: {
      fontSize: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
