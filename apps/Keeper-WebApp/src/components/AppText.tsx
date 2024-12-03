type AppTextProps = {
  children: any;
  style?: React.CSSProperties;
  numberOfLines?: number;
  [x: string]: any;
};

const AppText = ({ children, style, numberOfLines, ...props }: AppTextProps) => {
  return (
    <span
      style={{
        ...{
          fontFamily: 'app-default-font',
          fontSize: 20,
          color: 'white',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: numberOfLines || 'none',
          whiteSpace: 'pre-line',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default AppText;
