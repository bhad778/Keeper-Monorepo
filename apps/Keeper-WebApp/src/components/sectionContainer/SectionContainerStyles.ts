import { useTheme } from "theme/theme.context";

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      marginBottom: 50,
    },
  } as const;

  return styles;
};

export default useStyles;
