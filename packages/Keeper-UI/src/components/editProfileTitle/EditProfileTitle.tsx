import React from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { AppBoldText, AppText } from 'components';

import { useStyles } from './EditProfileTitleStyles';

type TEditProfileTitle = {
  text: string;
  textStyles?: StyleProp<TextStyle>;
};

const EditProfileTitle = ({ text, textStyles }: TEditProfileTitle) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <AppBoldText style={[styles.text, textStyles]}>{text}</AppBoldText>
    </View>
  );
};

export default EditProfileTitle;
