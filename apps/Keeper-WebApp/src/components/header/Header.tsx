import { AppHeaderText } from 'components';

import { useStyles } from './HeaderStyles';

type THeader = {
  text: string;
  errorTextStyles?: React.CSSProperties;
  textInputLabelStyle?: React.CSSProperties;
};

const Header = ({ text, errorTextStyles, textInputLabelStyle }: THeader) => {
  const styles = useStyles();
  return (
    <div style={styles.container}>
      <AppHeaderText style={{ ...textInputLabelStyle, ...errorTextStyles }}>{text}</AppHeaderText>
    </div>
  );
};

export default Header;
