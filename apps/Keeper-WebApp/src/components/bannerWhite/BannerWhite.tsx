import { useStyles } from './BannerWhiteStyles';

import { ReactNode } from 'react';
type TBannerWhite = {
  children: ReactNode;
};

const BannerWhite = ({ children }: TBannerWhite) => {
  const styles = useStyles();

  return <div style={styles.containerStyles}>{children}</div>;
};

export default BannerWhite;
