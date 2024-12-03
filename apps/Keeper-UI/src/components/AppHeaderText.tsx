import React from 'react';
import { Text } from 'react-native';

type TAppTextProps = {
  children: any;
  numberOfLines?: number;
  style?: any;
};

const AppHeaderText = ({ style, children, numberOfLines }: TAppTextProps) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontFamily: 'app-header-font', color: 'white', fontSize: 42, lineHeight: 42 }, style]}>
      {children}
    </Text>
  );
};

export default AppHeaderText;
