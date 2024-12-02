import { StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (rowNumber: number) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    bottomModalView: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    modal: {
      width: '100%',
      height: rowNumber ? rowNumber * 60 + 120 : '30%',
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: 'white',
      padding: 20,
      paddingRight: 0,
      paddingLeft: 0,
    },
    keepButtonLike: {
      width: '90%',
      height: 60,
      borderWidth: 0,
      display: 'flex',
      flexDirection: 'row',
      position: 'absolute',
      bottom: 20,
    },
    keepButtonTextLike: {
      fontWeight: 'bold',
      marginRight: 10,
      fontSize: 22,
    },
    xIcon: {
      position: 'absolute',
      top: -15,
      left: 160,
      zIndex: 1,
    },
  });

  return styles;
};

export default useStyles;
