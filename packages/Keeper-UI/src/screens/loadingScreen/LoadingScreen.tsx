import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import useStyles from './LoadingScreenStyles';

const LoadingScreen = () => {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={'white'} style={styles.spinner} />
    </View>
  );
};

export default LoadingScreen;
