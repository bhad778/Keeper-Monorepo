type AppTextProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  numberOfLines?: number;
  [x: string]: any;
};

const AppHeaderText = ({ children, style, numberOfLines, ...props }: AppTextProps) => {
  return (
    <span
      style={{
        ...{
          fontFamily: 'app-header-font',
          color: 'white',
          fontSize: 44,
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: numberOfLines || 'none',
        },
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  );
};

export default AppHeaderText;
