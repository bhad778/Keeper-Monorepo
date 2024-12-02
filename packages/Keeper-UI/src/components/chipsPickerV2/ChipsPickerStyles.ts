import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    chipsPickerContainer: {
      overflow: 'scroll',
      paddingBottom: 120,
      alignItems: 'center',
    },
    keeperButtonStyles: {
      width: '47%',
    },
    buttonTextStyles: {
      fontSize: 14,
    },
    addSkillButton: {
      position: 'absolute',
      right: -6,
      top: 22,
      width: '30%',
      height: '65%',
      backgroundColor: theme.color.white,
    },
    addSkillButtonText: {
      color: theme.color.black,
    },
    addedChipsContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 30,
      flexDirection: 'row',
    },
    addSkillText: {
      color: 'white',
      fontSize: 20,
      // marginLeft: 20,
    },
    chipsContainer: {
      height: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'scroll',
    },
    chipsScrollView: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingBottom: 150,
    },
    searchInput: {
      height: 50,
      borderBottomWidth: theme.general.borderWidth,
      borderColor: 'white',
      color: 'white',
      width: '90%',
      //padding: 10,
    },
    addSkillInput: {
      height: 50,
      borderBottomWidth: theme.general.borderWidth,
      borderColor: 'white',
      width: '90%',
      color: 'white',
      // padding: 10,
    },
    selectedChipsContainer: {},
  });

  return styles;
};

export default useStyles;
