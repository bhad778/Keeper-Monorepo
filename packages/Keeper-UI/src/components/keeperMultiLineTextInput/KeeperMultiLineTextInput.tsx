import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import { useTheme } from 'theme/theme.context';
type KeeperMultiLineTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeHolder: string;
  textColor: string;
};
const KeeperMultiLineTextInput = ({
  value,
  onChangeText,
  placeHolder,
  textColor,
  ...props
}: KeeperMultiLineTextInputProps) => {
  const [height, setHeight] = useState(0);

  const { theme } = useTheme();

  return (
    <TextInput
      {...props}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeHolder}
      placeholderTextColor={theme.color.secondary}
      multiline
      blurOnSubmit
      returnKeyType='done'
      onContentSizeChange={event => {
        setHeight(event.nativeEvent.contentSize.height + 20);
      }}
      style={[styles.input, { height: Math.max(35, height), color: textColor }]}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 10,
    fontSize: 16,
    fontFamily: 'app-bold-font',
  },
});

export default KeeperMultiLineTextInput;
