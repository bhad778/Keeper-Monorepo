import { AppBoldText, Clickable } from 'components';
import React, { useCallback } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { useStyles } from './ChipStyles';

type ChipProps = {
  name: string;
  onSelectChip?: (selectedChipName: string) => void;
  containerStyles?: React.CSSProperties;
  textStyles?: React.CSSProperties;
  hasDownArrow?: boolean;
};

const Chip = ({ name, onSelectChip, containerStyles, textStyles, hasDownArrow }: ChipProps) => {
  const styles = useStyles();

  const onPressChip = useCallback(() => {
    if (onSelectChip) {
      onSelectChip(name);
    }
  }, [name, onSelectChip]);

  if (onSelectChip) {
    return (
      <Clickable style={{ ...styles.chip, ...containerStyles }} onClick={onPressChip}>
        <AppBoldText style={{ ...styles.chipText, ...textStyles }}>{name}</AppBoldText>
        {hasDownArrow && <KeyboardArrowDownIcon sx={styles.downIcon} />}
      </Clickable>
    );
  } else {
    return (
      <div style={{ ...styles.chip, ...containerStyles }}>
        <AppBoldText style={{ ...styles.chipText, ...textStyles }}>{name}</AppBoldText>
      </div>
    );
  }
};

export default Chip;
