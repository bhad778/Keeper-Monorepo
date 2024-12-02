import React from 'react';
import { ActivityIndicator } from 'react-native';

import { useStyles } from './KeeperSpinnerOverlayStyles';
import { useTheme } from 'theme/theme.context';

interface KeeperSpinnerOverlayProps {
  isLoading: boolean;
  color?: string;
}

const KeeperSpinnerOverlay = ({ isLoading, color }: KeeperSpinnerOverlayProps) => {
  const { theme } = useTheme();
  const styles = useStyles();

  return (
    <>
      {isLoading && <ActivityIndicator size='large' color={color || theme.color.spinnerColor} style={styles.spinner} />}
    </>
  );
};

export default KeeperSpinnerOverlay;
