import { useTheme } from "theme/theme.context";

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    button: {
      minHeight: 20,
      minWidth: 40,
      backgroundColor: theme.color.keeperGrey,
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    text: {
      fontSize: 22,
      color: "black",
    },
  };

  return styles;
};

export default useStyles;
