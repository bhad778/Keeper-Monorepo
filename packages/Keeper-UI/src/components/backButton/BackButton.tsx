import React, { memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useStyles } from './BackButtonStyles';
// import BlackBackIcon from '../../assets/svgs/arrow_left_black.svg';
// import WhiteBackIcon from '../../assets/svgs/arrow_left_white.svg';

type TBackButton = {
  touchableContainerStyles?: StyleProp<ViewStyle>;
  iconStyles?: StyleProp<ViewStyle>;
  isBlack?: boolean;
  goBackAction?: () => void;
};

const BackButton = ({ touchableContainerStyles, iconStyles, isBlack, goBackAction }: TBackButton) => {
  const styles = useStyles();
  const navigation = useNavigation();

  const onBackPress = () => {
    if (goBackAction) {
      goBackAction();
    } else {
      navigation.goBack();
    }
  };

  return (
    <TouchableOpacity style={[styles.touchable, touchableContainerStyles]} onPress={onBackPress} hitSlop={50}>
      {isBlack ? (
        <Ionicons name='arrow-back' size={35} color='black' />
      ) : (
        <Ionicons name='arrow-back' size={35} color='white' />
      )}
    </TouchableOpacity>
  );
};

export default memo(BackButton);
