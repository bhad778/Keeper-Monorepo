import { useTheme } from 'theme/theme.context';

export const useStyles = (isBig: boolean, selected?: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    benefitButtons: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.white,
      borderRadius: 50,
      border: 'unset',
      height: isBig ? 66 : 50,
      margin: 6,
      paddingLeft: 13,
      paddingRight: 13,
    },
    benefitsButtonsPressed: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.color.pink,
      borderRadius: 50,
      border: 'unset',
      height: isBig ? 66 : 50,
      margin: 6,
      paddingLeft: 13,
      paddingRight: 13,
    },
    buttonText: {
      color: 'black',
      fontSize: isBig ? 25 : 14,
      textAlign: 'center',
    },
    smallButtonText: {
      fontSize: isBig ? 17 : 12,
    },
    // New styles for icon integration
    buttonContentContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px', // Spacing between icon and text
    },
    buttonIcon: {
      color: selected ? 'black' : theme.color.primary,
      height: isBig ? 28 : 20,
      width: isBig ? 28 : 20,
    },
  } as const;

  return styles;
};

export default useStyles;
