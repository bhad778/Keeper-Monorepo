import React from 'react';
import { NativeSyntheticEvent, StyleProp, TextInput, TextInputKeyPressEventData, TextStyle } from 'react-native';

import { useStyles } from './KeeperTextInputStyles';

type TKeeperTextInput = {
  inputStyles?: StyleProp<TextStyle>;
  onKeyPress?: (event: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  [x: string]: any;
};

const KeeperTextInput = ({ inputStyles, onKeyPress, ...props }: TKeeperTextInput) => {
  const styles = useStyles();
  return (
    <TextInput
      style={[styles.textInput, inputStyles]}
      keyboardAppearance={'dark'}
      onKeyPress={onKeyPress}
      autoCapitalize={'words'}
      returnKeyType='done'
      {...props}
    />
  );
};

export default KeeperTextInput;
