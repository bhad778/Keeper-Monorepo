import { useWindowDimensions } from 'hooks';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();
  const { windowHeight, windowWidth } = useWindowDimensions();

  const styles: { [k: string]: React.CSSProperties } = {
    jobPostingContainer: {
      backgroundColor: theme.color.primary,
      minHeight: windowHeight,
    },
    loadingContainer: {
      height: windowHeight,
      width: windowWidth,
      backgroundColor: theme.color.primary,
    },
    text: {
      color: theme.color.white,
    },
    backButton: {
      position: 'absolute',
      top: 55,
      left: 20,
    },
    modalHeader: {
      borderBottomWidth: 0,
      backgroundColor: theme.color.primary,
    },
    backButtonIcon: {
      color: 'white',
    },
  } as const;

  return styles;
};

export default useStyles;
