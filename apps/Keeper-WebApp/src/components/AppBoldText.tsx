type AppBoldTextProps = {
  children: any;
  numberOfLines?: number;
  style?: any;
};

const AppBoldText = ({ children, numberOfLines, style }: AppBoldTextProps) => {
  return (
    <span
      style={{
        ...{
          fontFamily: "app-bold-font",
          color: "white",
          textOverflow: "ellipsis",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: numberOfLines || "none",
        },
        ...style,
      }}
    >
      {children}
    </span>
  );
};

export default AppBoldText;
