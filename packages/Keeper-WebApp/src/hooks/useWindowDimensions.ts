import { useState, useEffect } from 'react';

const useWindowDimensions = () => {
  const hasWindow = typeof window !== 'undefined';

  const getWindowDimensions = () => {
    const windowWidth = hasWindow ? window.innerWidth : 0;
    const windowHeight = hasWindow ? window.innerHeight : 0;
    return {
      windowWidth,
      windowHeight,
    };
  };

  const handleResize = () => {
    setWindowDimensions(getWindowDimensions());
  };

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
};

export default useWindowDimensions;
