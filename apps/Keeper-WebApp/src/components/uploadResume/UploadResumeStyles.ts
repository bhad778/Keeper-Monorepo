export const useStyles = () => {
  const styles: { [k: string]: React.CSSProperties } = {
    headerText: {
      fontSize: 25,
      marginBottom: 20,
    },
    uploadButton: {
      marginTop: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
