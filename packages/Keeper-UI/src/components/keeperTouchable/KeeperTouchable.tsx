import React from 'react';
import { TouchableOpacity as TouchableAndroid } from 'react-native';
import { TouchableOpacity as TouchableIos, Platform, TouchableOpacityProps } from 'react-native';

const isAndroid = Platform.OS === 'android';

type KeeperTouchableType = { children: React.ReactNode } & TouchableOpacityProps;

const KeeperTouchable = ({ children, ...props }: KeeperTouchableType) => {
  if (isAndroid) {
    return <TouchableAndroid {...props}>{children}</TouchableAndroid>;
  } else {
    return <TouchableIos {...props}>{children}</TouchableIos>;
  }
};

export default KeeperTouchable;
