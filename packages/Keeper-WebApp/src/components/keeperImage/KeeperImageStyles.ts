import { useTheme } from 'theme/theme.context';

export const useStyles = (isImageReady: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    spinner: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      zIndex: 1,
    },
    emptyCompanyLogoContainer: {
      backgroundColor: isImageReady ? theme.color.darkGrey : 'unset',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: isImageReady ? 0 : 'unset',
      width: isImageReady ? 0 : 'unset',
    },
  } as const;

  return styles;
};

export default useStyles;
