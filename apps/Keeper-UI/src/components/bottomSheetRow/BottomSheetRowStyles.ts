import { StyleSheet } from 'react-native';

export const useStyles = (isLastRow?: boolean) => {
  const styles = StyleSheet.create({
    menuListItem: {
      borderBottomWidth: isLastRow ? 0 : 1,
      height: 60,
      justifyContent: 'center',
      width: '90%',
    },

    menuListText: {
      fontSize: 20,
    },

    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 20,
      alignSelf: 'flex-end',
    },
  });
  return styles;
};

export default useStyles;
