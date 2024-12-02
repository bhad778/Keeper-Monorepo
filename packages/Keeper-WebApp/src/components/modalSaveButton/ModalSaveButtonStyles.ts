import { useTheme } from 'theme/theme.context';

export const useStyles = (disabled: boolean) => {
  const { theme } = useTheme();

  const styles: { [k: string]: React.CSSProperties } = {
    modalSaveButton: {
      backgroundColor: disabled ? theme.color.keeperGrey : theme.color.pink,
      position: 'absolute',
      top: 10,
      right: 10,
      borderRadius: 15,
      padding: 10,
      zIndex: 1,
    },
    modalSaveText: {
      color: 'black',
      fontSize: 20,
    },
  } as const;

  return styles;
};

export default useStyles;
