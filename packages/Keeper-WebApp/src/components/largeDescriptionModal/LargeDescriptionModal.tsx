import { KeeperMultiLineInput } from 'components';

import { useStyles } from './LargeDescriptionModalStyles';

type LargeDescriptionTextFieldProps = {
  text: string;
  setText: (text: string) => void;
  placeholder?: string;
};

const LargeDescriptionTextField = ({ text, setText, placeholder }: LargeDescriptionTextFieldProps) => {
  const styles = useStyles();

  return (
    <div style={styles.LargeDescriptionBubble}>
      <KeeperMultiLineInput
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
        }}
      />
    </div>
  );
};

export default LargeDescriptionTextField;
