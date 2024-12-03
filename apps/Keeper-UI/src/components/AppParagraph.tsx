import React from "react";
import { Text } from "react-native";

const AppParagraph = (props) => {
  return (
    <Text
      style={[
        {
          fontFamily: "app-default-font",
          lineHeight: 25,
          fontSize: 15,
          textAlign: "justify",
        },
        props.style,
      ]}
    >
      {props.children}
    </Text>
  );
};

export default AppParagraph;
