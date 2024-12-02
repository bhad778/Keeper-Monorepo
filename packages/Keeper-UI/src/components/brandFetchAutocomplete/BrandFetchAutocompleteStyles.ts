import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      zIndex: 1,
    },
    companyList: {
      position: 'absolute',
      width: '100%',
      top: 50,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      borderWidth: 1,
      borderColor: 'white',
      borderStyle: 'solid',
      backgroundColor: theme.color.primary,
    },
    companyListItem: {
      height: 70,
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: 'white',
      borderStyle: 'solid',
      paddingLeft: 15,
      paddingRight: 15,
    },
    companyNameText: {
      color: theme.color.white,
      fontSize: 25,
      width: '90%',
    },
    dontSeeCompanyText: {
      color: theme.color.white,
      fontSize: 20,
    },
    logoImage: {
      borderRadius: 5,
      height: 30,
      width: 30,
    },
    anonContainer: {
      position: 'absolute',
      right: 0,
      top: -30,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'row',
    },
    anonymousText: {
      fontSize: 15,
      color: theme.color.white,
      paddingRight: 10,
    },
    checkBox: {
      color: theme.color.pink,
      top: 10,
    },
  });
  return styles;
};

export default useStyles;
