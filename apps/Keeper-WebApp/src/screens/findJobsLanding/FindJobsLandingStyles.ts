import { navBarHeight } from 'constants/globalConstants';
import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      display: 'flex',
      flexDirection: 'row',
      width: '100vw',
      height: `calc(100vh - ${navBarHeight}px)`,
      backgroundColor: theme.color.primary,
      overflow: 'hidden', // Prevent the entire page from scrolling
    },
  };

  return styles;
};

export default useStyles;
