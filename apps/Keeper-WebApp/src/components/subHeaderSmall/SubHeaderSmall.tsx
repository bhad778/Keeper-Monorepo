import { AppHeaderText } from "components";

import { useStyles } from "./SubHeaderSmallStyles";

type THeader = {
  text: string;
  errorTextStyles?: React.CSSProperties;
  textInputLabelStyle?: React.CSSProperties;
};

const Header = ({ text, errorTextStyles, textInputLabelStyle }: THeader) => {
  const styles = useStyles();
  return (
    <div style={styles.container}>
      <AppHeaderText
        style={{ ...styles.text, ...errorTextStyles, ...textInputLabelStyle }}
      >
        {text}
      </AppHeaderText>
    </div>
  );
};

export default Header;
