import { useTheme } from 'theme/theme.context';

export const useStyles = (disabled?: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    keeperButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: disabled ? theme.color.primary : theme.color.pink,
      borderRadius: 50,
      border: disabled ? '1px solid white' : 'unset',
      height: 50,
      margin: 6,
      paddingLeft: 13,
      paddingRight: 13,
    },
    buttonText: {
      color: disabled ? theme.color.white : theme.color.primary,
      fontSize: 14,
      textAlign: 'center',
    },
    smallButtonText: {
      fontSize: 12,
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
      color: theme.color.primary,
      height: 20,
      width: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
