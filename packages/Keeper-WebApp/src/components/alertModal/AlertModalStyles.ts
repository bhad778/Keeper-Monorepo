import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    alertModal: {
      width: 500,
    },
    titleStyle: {
      fontSize: 33,
      paddingBottom: 10,
    },
    subTitleStyle: {
      fontSize: 15,
      paddingLeft: 5,
    },
    bottomButtonsContainer: {
      display: 'flex',
      paddingTop: 50,
    },
    bottomButtonStyles: {
      width: '45%',
      backgroundColor: 'white',
    },
    bottomButtonTextStyles: {
      color: 'black',
    },
  } as const;

  return styles;
};

export default useStyles;
