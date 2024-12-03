import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modal: {
      backgroundColor: theme.color.primary,
      margin: 0,
    },
    yrsExperienceContainer: {
      flex: 1,
      alignItems: 'center',
      padding: 20,
      paddingTop: 110,
      display: 'flex',
    },
    titleText: {
      fontSize: 20,
      marginTop: 15,
      textAlign: 'center',
    },
    yearsText: {
      fontSize: 38,
      color: theme.color.white,
      left: 40,
      top: 40,
    },
    slider: {},
    pickerContainer: {
      width: '50%',
      justifyContent: 'center',
      marginTop: 60,
    },
  } as const;

  return styles;
};

export default useStyles;
