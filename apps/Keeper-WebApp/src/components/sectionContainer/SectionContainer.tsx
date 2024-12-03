import useStyles from './SectionContainerStyles';

type SectionContainerProps = {
  containerStyles?: React.CSSProperties;
  children: React.ReactNode;
};

const SectionContainer = ({ containerStyles, children }: SectionContainerProps) => {
  const styles = useStyles();

  return <div style={{ ...styles.container, ...containerStyles }}>{children}</div>;
};

export default SectionContainer;
