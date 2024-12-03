import { useCallback } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

export const useStyles = (isNew: boolean, selectedJobColor: string) => {
  const { theme } = useTheme();

  const returnContainerHeight = useCallback(() => {
    if (Platform.OS === 'ios') {
      if (isNew) {
        return 110;
      } else {
        return 120;
      }
    } else {
      return 80;
    }
  }, [isNew]);

  const returnContainerBottomPadding = useCallback(() => {
    if (Platform.OS === 'ios') {
      if (isNew) {
        return 10;
      } else {
        return 0;
      }
    } else {
      return 30;
    }
  }, [isNew]);

  const styles = StyleSheet.create({
    safeAreaView: {
      zIndex: 1,
    },
    container: {
      width: '100%',
      flexDirection: 'column',
      zIndex: 1,
      backgroundColor: selectedJobColor,
      paddingTop: 5,
    },
    previewContainer: {
      display: 'flex',
      borderBottomColor: theme.color.white,
      borderBottomWidth: 1,
    },
    previewText: {
      textAlign: 'center',
      fontSize: 24,
      bottom: 10,
    },
    previewSubtitleText: {
      textAlign: 'center',
      fontSize: 14,
      bottom: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    title: {
      color: theme.color.white,
    },
    subTitleContainer: {
      position: 'absolute',
      bottom: 10,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '62%',
    },
    subTitle: {
      fontSize: 18,
      lineHeight: 18,
      top: 4,
    },
    dropdown: {},
    text: {
      color: theme.color.primary,
    },
    filterContainer: {
      height: 60,
      paddingTop: 10,
      marginTop: 5,
      backgroundColor: theme.color.primary,
    },
    filterScrollView: {
      paddingLeft: 15,
      paddingRight: 100,
    },
    chipContainerStyles: {
      backgroundColor: theme.color.primary,
      borderColor: theme.color.white,
      borderWidth: 1,
      height: 40,
      paddingLeft: 15,
      paddingRight: 15,
    },
    lastChip: {
      marginRight: 30,
    },
    chipTextStyles: {
      color: theme.color.white,
      fontSize: 15,
    },
  });
  return styles;
};

export default useStyles;
