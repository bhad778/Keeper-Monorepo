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
  // New props for icon support
  IconComponent?: React.ComponentType<any>;
  iconProps?: Record<string, any>;
  iconPosition?: 'left' | 'right';
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
  // New props with defaults
  IconComponent,
  iconProps = {},
  iconPosition = 'left',
}: KeeperSelectButtonProps) => {
  const styles = useStyles(isBig || false, selected);

  // Determine if we need to render the icon
  const showIcon = !isLoading && IconComponent;

  // Get the correct text component based on isAppHeaderText
  const TextComponent = isAppHeaderText ? AppHeaderText : AppBoldText;

  // Calculate button text styles
  const buttonTextStyles = {
    ...styles.buttonText,
    ...(title.length > 15 ? styles.smallButtonText : {}),
    ...textStyles,
    ...(selected ? selectedTextStyles : unSelectedTextStyles),
  };

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
      }}>
      <div style={styles.buttonContentContainer}>
        {/* Render left-positioned icon if needed */}
        {showIcon && iconPosition === 'left' && <IconComponent style={styles.buttonIcon} {...iconProps} />}

        {/* Button text or loading spinner */}
        <TextComponent style={buttonTextStyles}>
          {isLoading ? (
            <Triangle
              height='20'
              width='20'
              color='#4fa94d'
              ariaLabel='triangle-loading'
              wrapperStyle={{}}
              visible={true}
            />
          ) : (
            title
          )}
        </TextComponent>

        {/* Render right-positioned icon if needed */}
        {showIcon && iconPosition === 'right' && <IconComponent style={styles.buttonIcon} {...iconProps} />}
      </div>

      {children}
    </Clickable>
  );
};

export default KeeperSelectButton;
