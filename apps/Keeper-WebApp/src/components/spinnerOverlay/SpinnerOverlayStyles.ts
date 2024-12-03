export const useStyles = () => {
  const styles: { [k: string]: React.CSSProperties } = {
    spinnerOverlay: {
      position: 'fixed',
      zIndex: 999999999999999,
      top: 0,
      // 125 is width of left side bar
      left: 125,
      right: 0,
      bottom: 0,
      opacity: 0.5,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  } as const;

  return styles;
};

export default useStyles;
