import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Badge } from 'react-native-paper';

const WithBadge = ({ children, hasNotification }) => {
  return (
    <View>
      {hasNotification && <Badge size={13} style={styles.badge} />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { position: 'absolute', bottom: 30, right: -10, zIndex: 1 },
  // badge: { position: 'absolute', bottom: 30, right: -10, zIndex: 1 },
});

export default WithBadge;
