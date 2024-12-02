import React from 'react';
import { ActivityIndicator } from 'react-native';

import { AppBoldText, AppHeaderText, KeeperTouchable } from 'components';

import { useStyles } from './KeeperSelectButtonStyles';

interface KeeperSelectButtonProps {
  onPress: (index: any) => void;
  title: string;
  key?: number | string;
  selected?: boolean;
  buttonStyles?: React.CSSProperties;
  selectedButtonStyles?: any;
  unSelectedButtonStyles?: any;
  selectedTextStyles?: any;
  unSelectedTextStyles?: any;
  textStyles?: React.CSSProperties;
  isBig?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  isAppHeaderText?: boolean;
}

const KeeperSelectButton = ({
  onPress,
  selected,
  key,
  title,
  buttonStyles,
  textStyles,
  selectedButtonStyles,
  unSelectedButtonStyles,
  selectedTextStyles,
  unSelectedTextStyles,
  isBig,
  isLoading,
  disabled,
  isAppHeaderText,
}: KeeperSelectButtonProps) => {
  const styles = useStyles(isBig || false, selected);

  return (
    <KeeperTouchable
      key={key || 0}
      onPress={() => onPress(key || title)}
      disabled={disabled}
      style={[
        selected
          ? { ...styles.benefitsButtonsPressed, ...selectedButtonStyles }
          : { ...styles.benefitButtons, ...unSelectedButtonStyles },
        buttonStyles,
      ]}>
      {isAppHeaderText ? (
        <AppHeaderText
          style={[
            styles.buttonText,
            textStyles,
            title.length > 15 ? styles.smallButtonText : '',
            selected ? selectedTextStyles : unSelectedTextStyles,
          ]}>
          {isLoading ? <ActivityIndicator color='black' size='small' /> : title}
        </AppHeaderText>
      ) : (
        <AppBoldText
          style={[
            styles.buttonText,
            textStyles,
            title.length > 15 ? styles.smallButtonText : '',
            selected ? selectedTextStyles : unSelectedTextStyles,
          ]}>
          {isLoading ? <ActivityIndicator color='black' size='small' /> : title}
        </AppBoldText>
      )}

      {/* <AntDesign name='heart' size={20} /> */}
    </KeeperTouchable>
  );
};

export default KeeperSelectButton;
