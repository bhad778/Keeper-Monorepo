export const useStyles = () => {
  const styles: { [k: string]: React.CSSProperties } = {
    headerText: {
      fontSize: 25,
    },
    pdfContainer: {
      width: '100%',
      height: '70vh',
      marginTop: '20px',
      marginBottom: '20px',
      border: '1px solid #444',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    pdfViewer: {
      width: '100%',
      height: '100%',
      border: 'none',
    },
    resumeHeader: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
  } as const;

  return styles;
};

export default useStyles;
