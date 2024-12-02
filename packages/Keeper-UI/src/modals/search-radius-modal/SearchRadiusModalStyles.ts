import { StyleSheet, Dimensions } from "react-native";
import { useTheme } from "theme/theme.context";

const SCREEN_WIDTH = Dimensions.get("window").width;

export const useStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    modal: {
      width: SCREEN_WIDTH,
      backgroundColor: theme.color.white,
      margin: 0,
    },
    sliderSection: {
      flex: 6,
      padding: 20,
      alignItems: "center",
    },
  });

  return styles;
};

export default useStyles;
