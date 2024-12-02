export const useStyles = (numberOfLines: number) => {
  const styles: { [k: string]: React.CSSProperties } = {
    container: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitBoxOrient: 'vertical',
      WebkitLineClamp: numberOfLines,
    },
  } as const;

  return styles;
};

export default useStyles;
