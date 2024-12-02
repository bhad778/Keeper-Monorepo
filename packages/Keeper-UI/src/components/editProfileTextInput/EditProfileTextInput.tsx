import React from 'react';
import { KeeperTextInput } from 'components';

import { StyleProp, TextStyle } from 'react-native';

type TEditProfileTextInput = {
  value: string | undefined;
  stateKeyName: string;
  onChangeText: (value: string, keyName: string) => void;
  inputStyles?: StyleProp<TextStyle>;
  [x: string]: any;
};

const EditProfileTextInput = ({ value, stateKeyName, onChangeText, inputStyles, ...props }: TEditProfileTextInput) => {
  return (
    <KeeperTextInput
      inputStyles={inputStyles}
      value={value}
      onChangeText={value => onChangeText(value, stateKeyName)}
      {...props}
    />
  );
};

export default EditProfileTextInput;
