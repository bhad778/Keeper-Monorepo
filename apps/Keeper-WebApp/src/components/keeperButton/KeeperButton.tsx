import React from 'react';
import { AppBoldText, AppHeaderText, Clickable } from 'components';
// @ts-ignore
import { Triangle } from 'react-loader-spinner';

import { useStyles } from './KeeperButtonStyles';

interface KeeperButtonProps {
  onClick: (index: any) => void;
  text: string;
  key?: number | string;
  buttonStyles?: React.CSSProperties;
  textStyles?: React.CSSProperties;
  isLoading?: boolean;
  disabled?: boolean;
  isAppHeaderText?: boolean;
  IconComponent?: React.ComponentType<any>;
  iconProps?: Record<string, any>;
  iconPosition?: 'left' | 'right';
}

const KeeperButton = ({
  onClick,
  key,
  text,
  buttonStyles,
  textStyles,
  isLoading,
  disabled,
  isAppHeaderText,
  IconComponent,
  iconProps = {},
  iconPosition = 'left',
}: KeeperButtonProps) => {
  const styles = useStyles(disabled);

  // Determine if we need to render the icon
  const showIcon = !isLoading && IconComponent;

  // Get the correct text component based on isAppHeaderText
  const TextComponent = isAppHeaderText ? AppHeaderText : AppBoldText;

  // Calculate button text styles
  const buttonTextStyles = {
    ...styles.buttonText,
    ...(text.length > 15 ? styles.smallButtonText : {}),
    ...textStyles,
  };

  return (
    <Clickable
      key={key || 0}
      onClick={() => onClick(key || text)}
      disabled={disabled}
      style={{ ...styles.keeperButton, ...buttonStyles }}>
      <div style={styles.buttonContentContainer}>
        {showIcon && iconPosition === 'left' && <IconComponent style={styles.buttonIcon} {...iconProps} />}

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
            text
          )}
        </TextComponent>

        {showIcon && iconPosition === 'right' && <IconComponent style={styles.buttonIcon} {...iconProps} />}
      </div>
    </Clickable>
  );
};

export default KeeperButton;
