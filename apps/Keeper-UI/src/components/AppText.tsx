import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

type AppTextProps = {
  children: any;
  style?: StyleProp<TextStyle>;
  [x: string]: any;
};

const AppText = ({ children, style, ...props }: AppTextProps) => {
  return (
    <Text style={[{ fontFamily: 'app-default-font', lineHeight: 24, fontSize: 18, color: 'white' }, style]} {...props}>
      {children}
    </Text>
  );
};

export default AppText;
