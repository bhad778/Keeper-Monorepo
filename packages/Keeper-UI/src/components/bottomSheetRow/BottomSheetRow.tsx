import React, { ReactNode } from 'react';
import { TouchableOpacity } from 'react-native';
import { useStyles } from './BottomSheetRowStyles';

type BottomSheetRowProps = {
  children: ReactNode;
  onPress: () => void;
  isLastRow?: boolean;
};
const BottomSheetRow = ({ children, onPress, isLastRow }: BottomSheetRowProps) => {
  const styles = useStyles(isLastRow);

  return (
    <TouchableOpacity style={styles.menuListItem} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

export default BottomSheetRow;
