import { useState } from 'react';
import { Triangle } from 'react-loader-spinner';
import { useDidMountEffect } from 'hooks';

import { useStyles } from './KeeperImageStyles';

interface KeeperImageProps {
  style?: any;
  source: string;
  resizeMode?:
    | 'contain'
    | 'cover'
    | 'fill'
    | 'inherit'
    | 'initial'
    | 'none'
    | 'revert'
    | 'revert-layer'
    | 'scale-down'
    | 'unset';
  isApiCallLoading?: boolean;
}

const KeeperImage = ({ style, source, isApiCallLoading, resizeMode }: KeeperImageProps) => {
  const [isImagePreparing, setIsImagePreparing] = useState(false);
  const [isLoading, setIsLoading] = useState(isImagePreparing || isApiCallLoading);

  const isImageReady = !isLoading && !isImagePreparing;

  const styles = useStyles(isImageReady);

  useDidMountEffect(() => {
    setIsLoading(!!isApiCallLoading);
  }, [isApiCallLoading]);

  // useDidMountEffect(() => {
  //   setIsImagePreparing(true);
  // }, [source]);

  return (
    <>
      <div style={{ ...style, ...styles.emptyCompanyLogoContainer }}>
        <Triangle
          height="130"
          width="130"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          visible={!isImageReady}
        />
      </div>
      <img
        style={{
          ...style,
          ...{
            height: isLoading || isImagePreparing ? 0 : style?.height,
            objectFit: resizeMode || 'unset',
          },
        }}
        // onLoadStart={() => {
        //   setIsImagePreparing(true);
        // }}
        // onLoad={() => {
        //   setIsImagePreparing(false);
        // }}
        src={source}
      />
    </>
  );
};

export default KeeperImage;
