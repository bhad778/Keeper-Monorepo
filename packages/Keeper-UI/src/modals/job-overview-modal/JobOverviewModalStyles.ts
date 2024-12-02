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
    Header: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    textSection: {
      flex: 6,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      marginTop: 20,
    },
    textInput: {
      width: "90%",
      height: "90%",
      textAlignVertical: "top",
      marginTop: 20,
    },
  });

  return styles;
};

export default useStyles;
