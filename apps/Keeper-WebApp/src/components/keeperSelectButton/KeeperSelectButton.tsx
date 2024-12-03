import React from 'react';
import { AppBoldText, AppHeaderText, Clickable } from 'components';
import { Triangle } from 'react-loader-spinner';

import { useStyles } from './KeeperSelectButtonStyles';

interface KeeperSelectButtonProps {
  onClick: (index: any) => void;
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
  children?: React.ReactNode;
}

const KeeperSelectButton = ({
  onClick,
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
  children,
}: KeeperSelectButtonProps) => {
  const styles = useStyles(isBig || false, selected);

  return (
    <Clickable
      key={key || 0}
      onClick={() => onClick(key || title)}
      disabled={disabled}
      style={{
        ...(selected
          ? { ...styles.benefitsButtonsPressed, ...selectedButtonStyles }
          : { ...styles.benefitButtons, ...unSelectedButtonStyles }),
        ...buttonStyles,
      }}
    >
      {isAppHeaderText ? (
        <AppHeaderText
          style={{
            ...styles.buttonText,
            ...(title.length > 15 ? styles.smallButtonText : ''),
            ...textStyles,
            ...(selected ? selectedTextStyles : unSelectedTextStyles),
          }}
        >
          {isLoading ? (
            <Triangle
              height="20"
              width="20"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              visible={true}
            />
          ) : (
            title
          )}
        </AppHeaderText>
      ) : (
        <AppBoldText
          style={{
            ...styles.buttonText,
            ...(title.length > 15 ? styles.smallButtonText : ''),
            ...textStyles,
            ...(selected ? selectedTextStyles : unSelectedTextStyles),
          }}
        >
          {isLoading ? (
            <Triangle
              height="20"
              width="20"
              color="#4fa94d"
              ariaLabel="triangle-loading"
              wrapperStyle={{}}
              visible={true}
            />
          ) : (
            title
          )}
        </AppBoldText>
      )}
      {children}
    </Clickable>
  );
};

export default KeeperSelectButton;
