import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    backArrowContainer: {
      display: 'flex',
      position: 'absolute',
      top: 10,
      left: theme.spacing.horizontalPadding,
      zIndex: 1,
    },
    backText: {
      color: theme.color.white,
      flex: 1,
      textAlign: 'center',
      paddingLeft: 15,
      paddingTop: 12,
    },
    backIcon: {
      color: theme.color.white,
      height: 50,
      width: 50,
    },
  } as const;

  return styles;
};

export default useStyles;
