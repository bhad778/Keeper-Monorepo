export const useStyles = () => {
  const styles: { [k: string]: React.CSSProperties } = {
    headerText: {
      fontSize: 25,
    },
  } as const;

  return styles;
};

export default useStyles;
