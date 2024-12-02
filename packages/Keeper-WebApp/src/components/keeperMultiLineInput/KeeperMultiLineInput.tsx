import TextareaAutosize from 'react-textarea-autosize';

import { useStyles } from './KeeperMultiLineInputStyles';

type KeeperMultiLineInputProps = {
  inputStyles?: React.CSSProperties;
  rows?: number;
  placeholder?: string;
  [x: string]: any;
};

const KeeperMultiLineInput = ({ inputStyles, placeholder, ...props }: KeeperMultiLineInputProps) => {
  const styles = useStyles();

  return (
    <TextareaAutosize style={{ ...styles.textArea, ...inputStyles }} {...props} minRows={4} placeholder={placeholder} />
  );
};

export default KeeperMultiLineInput;
