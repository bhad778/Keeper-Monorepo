import { useTheme } from "theme/theme.context";

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = {
    container: {
      backgroundColor: theme.color.darkGrey,
    },
  };

  return styles;
};

export default useStyles;
