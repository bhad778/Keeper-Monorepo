import { useTheme } from 'theme/theme.context';

export const useStyles = (isBig: boolean, selected?: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    benefitButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 30,
      backgroundColor: theme.color.primary,
      border: `solid ${theme.color.white}  ${theme.general.borderWidth}px`,
      display: 'flex',
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
    },
    benefitsButtonsPressed: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      borderRadius: 30,
      backgroundColor: theme.color.pink,
      display: 'flex',
      padding: 10,
      paddingLeft: 15,
      paddingRight: 15,
    },
    buttonTextPressed: {
      fontSize: isBig ? 20 : 18,
      color: theme.color.black,
    },
    buttonText: {
      fontSize: isBig ? 20 : 15,
      color: selected ? 'black' : 'white',
      whiteSpace: 'nowrap',
    },
    smallButtonText: {
      fontSize: 18,
    },
    bigButtons: {
      margin: 4,
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
      width: '47%',
      borderRadius: 30,
    },
    bigButtonText: {
      fontSize: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
