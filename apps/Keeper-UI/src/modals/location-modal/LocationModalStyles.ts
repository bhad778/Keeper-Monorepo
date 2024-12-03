import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    searchContainer: {
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 20,
    },
    contentsContainer: {
      alignItems: 'center',
      flex: 1,
      width: '100%',
      paddingTop: 40,
    },
    textInputContainer: {
      width: '90%',
      alignItems: 'center',
    },
    cityOptionsButtonsContainer: {
      backgroundColor: '#f0f0f0',
      width: '85%',
      alignItems: 'center',
      zIndex: 1,
      marginTop: 25,
      height: 200,
      borderRadius: 20,
    },
    cityOptionsButton: {
      zIndex: 1,
      borderBottomWidth: 2,
      width: '80%',
      height: '33%',
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomColor: '#dbdbdb',
    },
    lastCityOptionsButton: {
      zIndex: 1,
      width: '80%',
      height: '33%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cityOptionsButtonText: {
      color: theme.color.black,
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
      width: SCREEN_WIDTH,
      marginBottom: 20,
    },
    workSettingsButtons: {
      width: '30%',
    },
  });

  return styles;
};

export default useStyles;
