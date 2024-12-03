import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    inputPropsStyles: {
      border: 'none',
      backgroundColor: 'transparent',
      outline: 'none',
      boxShadow: 'none',
    },
    textArea: {
      fontSize: 20,
      width: '100%',
      marginBottom: 3,
      fontFamily: 'app-header-font',
      backgroundColor: theme.color.primary,
      padding: 'unset',
      color: 'white',
      boxShadow: 'none',
    },
  } as const;

  return styles;
};

export default useStyles;
