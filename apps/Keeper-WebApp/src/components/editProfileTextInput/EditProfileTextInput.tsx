import React from 'react';
import { KeeperTextInput } from 'components';

type TEditProfileTextInput = {
  value: string | undefined;
  stateKeyName: string;
  onChange: (value: string, keyName: string) => void;
  inputStyles?: React.CSSProperties;
  [x: string]: any;
};

const EditProfileTextInput = ({ value, stateKeyName, onChange, inputStyles, ...props }: TEditProfileTextInput) => {
  return (
    <KeeperTextInput
      inputStyles={inputStyles}
      value={value}
      onChange={(value) => onChange(value, stateKeyName)}
      {...props}
    />
  );
};

export default EditProfileTextInput;
