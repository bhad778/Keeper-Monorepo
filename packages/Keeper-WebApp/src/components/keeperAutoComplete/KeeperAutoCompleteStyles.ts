import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      position: 'relative',
      zIndex: 1,
    },
    companyList: {
      backgroundColor: theme.color.primary,
      position: 'absolute',
      width: '100%',
      top: 55,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      border: '1px white solid',
    },
    companyListItem: {
      height: 70,
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      cursor: 'pointer',
      borderTop: '1px white solid',
      paddingLeft: 15,
      paddingRight: 15,
    },
    dontSeeCompanyText: {
      color: theme.color.white,
      fontSize: 20,
    },
    companyNameText: {
      color: theme.color.white,
      fontSize: 25,
    },
    logoImage: {
      borderRadius: 5,
    },
    anonContainer: {
      position: 'absolute',
      right: 0,
      top: -50,
      zIndex: 1,
      display: 'flex',
    },
    anonymousText: {
      fontSize: 15,
      color: theme.color.white,
      paddingTop: 10,
    },
    checkBox: {
      color: theme.color.pink,
    },
  } as const;

  return styles;
};

export default useStyles;
