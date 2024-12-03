import useStyles from './ClickableStyles';

type ClickableProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  disabled?: boolean;
};

const Clickable = ({ onClick, children, style, disabled }: ClickableProps) => {
  const styles = useStyles(!!disabled);

  const onClickWrapper = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled) {
      onClick(event);
    }
  };

  return (
    <div style={{ ...styles.container, ...style }} onClick={onClickWrapper}>
      {children}
    </div>
  );
};

export default Clickable;
