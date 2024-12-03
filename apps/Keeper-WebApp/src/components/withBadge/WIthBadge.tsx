import { Badge } from 'components';
import useStyles from './WithBadgeStyles';

type WithBadgeProps = {
  children: React.ReactNode;
  hasNotification: boolean;
};

const WithBadge = ({ children, hasNotification }: WithBadgeProps) => {
  const styles = useStyles();

  return (
    <span style={styles.container}>
      {hasNotification && <Badge style={styles.badge} />}
      {children}
    </span>
  );
};

export default WithBadge;
