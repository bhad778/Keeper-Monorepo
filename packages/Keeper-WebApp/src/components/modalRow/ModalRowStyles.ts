export const useStyles = (isLastRow?: boolean) => {
  const styles: { [k: string]: React.CSSProperties } = {
    menuListItem: {
      borderBottomWidth: isLastRow ? 0 : 1,
      borderBottomStyle: 'solid',
      borderBottomColor: 'white',
      height: 60,
      justifyContent: 'space-between',
      alignItems: 'center',
      display: 'flex'
    },
    menuListText: {
      fontSize: 20
    },
    forwardIcon: {
      height: 14,
      width: 14,
      position: 'absolute',
      top: 20,
      alignSelf: 'flex-end'
    }
  } as const;

  return styles;
};

export default useStyles;
