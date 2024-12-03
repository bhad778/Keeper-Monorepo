import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    chipsPickerContainer: {
      height: '50vh',
    },
    keeperButtonStyles: {
      width: '23%',
    },
    selectedTextStyles: {
      color: theme.color.primary,
    },
    addedChipsContainer: {
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 20,
      paddingBottom: 30,
      flexDirection: 'row',
      display: 'flex',
    },
    addSkillText: {
      color: theme.color.black,
      fontSize: 13,
    },
    addSkillButton: {
      backgroundColor: theme.color.white,
      position: 'absolute',
      height: 30,
      right: 60,
      top: 180,
    },

    chipsContainer: {
      height: '100%',
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      overflow: 'scroll',
    },
    chipsScrollView: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'center',
      display: 'flex',
    },
    searchInput: {
      height: 50,
      backgroundColor: theme.color.primary,
    },
    addSkillInput: {
      height: 50,
    },
    selectedChipsContainer: {},
  } as const;

  return styles;
};

export default useStyles;
