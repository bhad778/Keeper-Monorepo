import { AppBoldText } from 'components';
import MuiButton from '@mui/material/Button';

import useStyles from './ButtonStyles';

type ButtonProps = {
  text: string;
  buttonStyles?: React.CSSProperties;
  textStyles?: React.CSSProperties;
  [k: string]: any;
};

const Button = ({ text, buttonStyles, textStyles, ...props }: ButtonProps) => {
  const styles = useStyles();

  return (
    <MuiButton style={{ ...styles.button, ...buttonStyles }} {...props}>
      <AppBoldText style={{ ...styles.text, ...textStyles }}>{text}</AppBoldText>
    </MuiButton>
  );
};

export default Button;
