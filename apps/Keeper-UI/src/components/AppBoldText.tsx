import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type AppBoldTextProps = {
  children: any;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
};

const AppBoldText = ({ children, numberOfLines, style }: AppBoldTextProps) => {
  return (
    <Text numberOfLines={numberOfLines} style={[{ fontFamily: 'app-bold-font', color: 'white' }, style]}>
      {children}
    </Text>
  );
};

export default AppBoldText;
