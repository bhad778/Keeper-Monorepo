import useStyles from './BadgeStyles';

type BadgeProps = {
  style?: React.CSSProperties;
};

const Badge = ({ style }: BadgeProps) => {
  const styles = useStyles();

  return <div style={{ ...styles.badge, ...style }} />;
};

export default Badge;
