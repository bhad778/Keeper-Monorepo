import { Dimensions, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';

const SCREEN_WIDTH = Dimensions.get('window').width;

export const useStyles = (isDropDownOpen: boolean, selectedJobColor: string) => {
  const { theme } = useTheme();

  const selectContainerHeight = 63;

  const styles = StyleSheet.create({
    container: {
      zIndex: 1,
      width: SCREEN_WIDTH,
      backgroundColor: selectedJobColor,
    },
    selectContainer: {
      height: selectContainerHeight,
      borderRadius: 5,
      display: 'flex',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 15,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderBottomLeftRadius: isDropDownOpen ? 0 : 5,
      borderBottomRightRadius: isDropDownOpen ? 0 : 5,
      flexDirection: 'row',
    },
    textContainer: {
      display: 'flex',
      paddingLeft: 13,
    },
    keeperLogoImg: {
      borderRadius: 5,
      height: 40,
      width: 40,
    },
    valueText: {
      fontSize: 24,
      color: theme.color.primary,
      textAlign: 'left',
    },
    subTitle: {
      fontSize: 16,
      textAlign: 'left',
      textTransform: 'capitalize',
      color: theme.color.primary,
    },
    companyList: {
      backgroundColor: theme.color.primary,
      position: 'absolute',
      width: '100%',
      top: selectContainerHeight,
      borderStyle: 'solid',
      borderColor: theme.color.primary,
      borderWidth: 1,
      overflow: 'hidden',
      borderBottomRightRadius: theme.general.borderRadius,
      borderBottomLeftRadius: theme.general.borderRadius,
    },
    companyListItem: {
      height: 85,
      display: 'flex',
      width: '102%',
      left: -2,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopColor: theme.color.primary,
      borderTopWidth: 1,
      borderStyle: 'solid',
      paddingLeft: 15,
      paddingRight: 15,
      flexDirection: 'row',
    },
    dontSeeCompanyText: {
      color: theme.color.white,
      fontSize: 20,
    },
    companyNameText: {
      color: theme.color.primary,
      fontSize: 25,
      lineHeight: 25,
      width: '60%',
    },
    logoImage: {
      borderRadius: 5,
      height: 50,
      width: 50,
    },
    downArrow: {
      position: 'absolute',
      fontSize: 24,
      color: theme.color.primary,
      top: 10,
      right: 15,
    },
  });
  return styles;
};

export default useStyles;
