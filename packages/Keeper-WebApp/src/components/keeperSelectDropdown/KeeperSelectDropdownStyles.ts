import { useTheme } from 'theme/theme.context';

export const useStyles = (isDropDownOpen: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      position: 'relative',
      zIndex: 1,
    },
    selectContainer: {
      border: 'solid 2px black',
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'row',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomLeftRadius: isDropDownOpen ? 0 : 5,
      borderBottomRightRadius: isDropDownOpen ? 0 : 5,
      minWidth: 300,
    },
    companyList: {
      backgroundColor: theme.color.primary,
      position: 'absolute',
      width: '100%',
      top: 62,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      border: '1px black solid',
      overflow: 'hidden',
    },
    companyListItem: {
      height: 70,
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      borderTop: '1px black solid',
      paddingLeft: 15,
      paddingRight: 15,
    },
    dontSeeCompanyText: {
      color: theme.color.white,
      fontSize: 20,
    },
    companyNameText: {
      color: theme.color.primary,
      fontSize: 25,
    },
    logoImage: {
      borderRadius: 5,
      height: 50,
      width: 50,
      marginRight: 40,
    },
    valueText: {
      fontSize: 28,
      color: theme.color.primary,
      marginRight: 20,
    },
    downArrow: {
      fontSize: 36,
      color: theme.color.primary,
      position: 'absolute',
      right: 0,
    },
  } as const;

  return styles;
};

export default useStyles;
