import React, { useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';
import { useTheme } from 'theme/theme.context';
import { useDidMountEffect } from 'hooks';

import { useStyles } from './KeeperImageStyles';

interface KeeperImageProps {
  source: any;
  style: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  isApiCallLoading?: boolean;
}

const KeeperImage = ({ style, source, resizeMode, isApiCallLoading }: KeeperImageProps) => {
  const [isImagePreparing, setIsImagePreparing] = useState(false);
  const [isLoading, setIsLoading] = useState(isImagePreparing || isApiCallLoading);

  const styles = useStyles();
  const { theme } = useTheme();

  useDidMountEffect(() => {
    setIsLoading(isApiCallLoading);
  }, [isApiCallLoading]);

  return (
    <>
      {isLoading ? (
        <View style={[style, styles.emptyCompanyLogoContainer]}>
          <ActivityIndicator color={theme.color.spinnerColor} style={styles.spinner} size='large' />
        </View>
      ) : (
        <Image
          style={[style, { height: isLoading ? 0 : style?.height }]}
          onLoadStart={() => setIsImagePreparing(true)}
          onLoadEnd={() => setIsImagePreparing(false)}
          resizeMode={resizeMode ? resizeMode : 'cover'}
          source={source}
        />
      )}
    </>
  );
};

export default KeeperImage;
