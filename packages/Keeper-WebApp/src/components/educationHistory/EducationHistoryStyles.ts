import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    contents: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
    },
    preferenceItem: {
      borderBottomStyle: 'solid',
      borderBottomWidth: 1.5,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      width: '100%',
      marginTop: 10,
    },
    addItemButton: {
      width: '100%',
      borderWidth: theme.general.borderWidth,
      backgroundColor: theme.color.pink,
    },
    addItemButtonText: {
      color: 'black',
    },
    addEducationButtonContainer: {
      marginTop: 15,
      width: '30%',
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 5,
      alignSelf: 'flex-end',
    },
    openItemIcon: {
      position: 'absolute',
      right: 0,
      top: 27,
    },
  } as const;

  return styles;
};

export default useStyles;
