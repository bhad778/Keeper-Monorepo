import { AppText, Clickable } from 'components';

import { useStyles } from './ModalRowStyles';

type BottomSheetRowProps = {
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  title: string;
  isLastRow?: boolean;
  style?: React.CSSProperties;
};

const ModalRow = ({ onClick, title, isLastRow, style }: BottomSheetRowProps) => {
  const styles = useStyles(isLastRow);

  return (
    <Clickable style={{ ...styles.menuListItem, ...style }} onClick={onClick}>
      <AppText style={styles.menuListText}>{title}</AppText>
      {/* <UpRightArrowWhite height={15} width={15} /> */}
    </Clickable>
  );
};

export default ModalRow;
