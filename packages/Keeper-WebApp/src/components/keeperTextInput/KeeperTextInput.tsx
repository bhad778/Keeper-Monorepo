import { CSSProperties, KeyboardEvent } from 'react';
import { AppText, Header, LoadingSpinner } from 'components';

import { useStyles } from './KeeperTextInputStyles';

type TKeeperTextInput = {
  onChange: (text: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement> | undefined) => void;
  label?: string;
  subLabel?: string;
  isLoading?: boolean;
  containerStyles?: CSSProperties;
  inputStyles?: CSSProperties;
  labelStyles?: CSSProperties;
  subLabelStyles?: CSSProperties;
  errorTextStyles?: CSSProperties;
  [x: string]: any;
};

const KeeperTextInput = ({
  onChange,
  onKeyDown,
  label,
  subLabel,
  isLoading,
  containerStyles,
  errorTextStyles,
  inputStyles,
  labelStyles,
  subLabelStyles,
  ...props
}: TKeeperTextInput) => {
  const styles = useStyles();

  return (
    <div style={{ ...styles.container, ...containerStyles }}>
      {label && (
        <Header
          text={label}
          errorTextStyles={errorTextStyles}
          textInputLabelStyle={{ ...styles.labelStyles, ...labelStyles }}
        />
      )}
      {subLabel && <AppText style={{ ...styles.subLabelStyles, ...subLabelStyles }}>{subLabel}</AppText>}

      <input
        type="text"
        style={{ ...styles.textInput, ...inputStyles }}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onKeyDown={onKeyDown}
        {...props}
      />

      {isLoading && <LoadingSpinner size="35" styles={styles.spinnerStyles} />}
    </div>
  );
};

export default KeeperTextInput;
