import { useTheme } from 'theme/theme.context';

export const useStyles = (isLastRow?: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      marginVertical: 10,
    },
    touchable: {
      width: '100%',
      height: 120,
      backgroundColor: theme.color.primary,
      // borderRadius: 17,
      borderColor: 'white',
      borderWidth: theme.general.borderWidth,
      zIndex: 1,
      // padding: 10,
    },
    text: {
      color: theme.color.white,
    },
    placeholderText: {
      color: theme.color.secondary,
    },
  } as const;

  return styles;
};

export default useStyles;
