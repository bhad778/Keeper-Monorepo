import { AppHeaderText } from 'components';

import { useStyles } from './SubHeaderLargeStyles';

type SubHeaderLargeProps = {
  text: string;
  errorTextStyles?: React.CSSProperties;
  textInputLabelStyle?: React.CSSProperties;
  containerStyles?: React.CSSProperties;
  [x: string]: any;
};

const SubHeaderLarge = ({
  text,
  errorTextStyles,
  containerStyles,
  textInputLabelStyle,
  ...props
}: SubHeaderLargeProps) => {
  const styles = useStyles();
  return (
    <div style={{ ...styles.container, ...containerStyles }}>
      <AppHeaderText style={{ ...styles.text, ...errorTextStyles, ...textInputLabelStyle }} {...props}>
        {text}
      </AppHeaderText>
    </div>
  );
};

export default SubHeaderLarge;
