import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    yearsOfExperienceText: {
      color: theme.color.white,
      fontSize: 26,
    },
    slider: {
      width: '100%',
      // height: 40,
    },
  } as const;

  return styles;
};

export default useStyles;
