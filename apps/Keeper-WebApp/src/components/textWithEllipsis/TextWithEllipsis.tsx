import useStyles from './TextWIthEllipsisStyles';

type TextWithEllipsisProps = {
  numberOfLines: number;
  containerStyles: React.CSSProperties;
  children: React.ReactNode;
};

const TextWithEllipsis = ({ numberOfLines, containerStyles, children }: TextWithEllipsisProps) => {
  const styles = useStyles(numberOfLines);

  return <div style={{ ...styles.container, ...containerStyles }}>{children}</div>;
};

export default TextWithEllipsis;
