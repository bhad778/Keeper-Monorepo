import { useTheme } from "theme/theme.context";

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      width: "36%",
    },
    placeholderColor: {
      color: "white",
    },
  } as const;

  return styles;
};

export default useStyles;
