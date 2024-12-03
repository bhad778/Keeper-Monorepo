import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.white,
      margin: 0,
    },
    employmentTypeContainer: {
      padding: 20,
      flex: 6,
      alignItems: 'center',
    },
    smallButtonText: {
      fontSize: 18,
    },
    employmentButtonsContainer: {
      width: '100%',
      marginTop: 60,
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 5,
      flexWrap: 'wrap',
    },
    employmentButtonsContainer2: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    employmentButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: '49%',
      backgroundColor: '#f0f0f0',
      borderRadius: 30,
    },
    employmentButtonsPressed: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f6cffe',
      height: 50,
      width: '49%',
      borderRadius: 30,
    },
  });

  return styles;
};

export default useStyles;
