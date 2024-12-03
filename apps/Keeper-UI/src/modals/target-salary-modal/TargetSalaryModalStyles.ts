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
    buttonsContainer: {
      justifyContent: "center",
      flexDirection: "row",
      marginTop: 60,
      width: "100%",
      marginBottom: 40,
    },
    buttons: {
      borderRadius: 30,
      width: "49%",
      height: 50,
      margin: 4,
      marginBottom: 10,
      backgroundColor: "#f0f0f0",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonsPressed: {
      borderRadius: 30,
      width: "49%",
      height: 50,
      margin: 4,
      marginBottom: 10,
      backgroundColor: "#f6cffe",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: theme.color.black,
      fontSize: 20,
    },
  });

  return styles;
};

export default useStyles;
