export const useStyles = () => {
  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
    },
    headerText: {
      fontSize: 30,
      textAlign: 'center',
    },
    resumeContainer: {
      height: '100%',
      width: '100%',
    },
    pdfContainer: {
      width: '100%',
      height: '90%',
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
      width: '100%',
      flexDirection: 'column',
    },
    resumeIconContainer: {
      flexDirection: 'row',
      display: 'flex',
    },
    resumeIcon: {
      color: 'white',
      marginRight: 10,
    },
    confirmContainer: {
      paddingBottom: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
