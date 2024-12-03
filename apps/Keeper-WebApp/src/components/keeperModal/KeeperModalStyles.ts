import { useTheme } from 'theme/theme.context';

export const useStyles = () => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modalContents: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '40%',
      backgroundColor: theme.color.primary,
      padding: 4,
      borderRadius: 5,
    },
    xIcon: {
      color: 'white',
      position: 'absolute',
      top: 10,
      left: 10,
    },
  } as const;

  return styles;
};

export default useStyles;
