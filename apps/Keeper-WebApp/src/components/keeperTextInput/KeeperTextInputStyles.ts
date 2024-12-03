import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      position: 'relative',
    },
    textInput: {
      fontSize: 25,
      width: '100%',
      height: 55,
      marginBottom: 15,
      fontFamily: 'app-header-font',
      backgroundColor: theme.color.primary,
      borderBottom: 'solid 1px white',
      color: 'white',
      borderRadius: 0,
      boxShadow: 'none',
      outline: 'none',
      paddingLeft: 0,
    },
    labelStyles: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingTop: 5,
      color: 'white',
    },
    subLabelStyles: {
      fontSize: 14,
      color: 'white',
    },
    spinnerStyles: {
      position: 'absolute',
      right: 0,
      top: 10,
    },
  } as const;

  return styles;
};

export default useStyles;
