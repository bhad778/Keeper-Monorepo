import { AppText } from 'components';
import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { useStyles } from './ChipStyles';

type ChipProps = {
  name: string;
  onSelectChip?: (selectedChipName: string) => void;
  containerStyles?: any;
  textStyles?: any;
  iconName?: string;
};

const Chip = ({ name, onSelectChip, containerStyles, textStyles, iconName }: ChipProps) => {
  const styles = useStyles();

  const onPressChip = useCallback(() => {
    if (onSelectChip) {
      onSelectChip(name);
    }
  }, [name, onSelectChip]);

  return (
    <TouchableOpacity style={[styles.chip, containerStyles]} onPress={onSelectChip ? onPressChip : () => null}>
      <AppText style={[styles.chipText, textStyles]}>{name}</AppText>
      {iconName && <FontAwesome color='white' name={iconName} size={20} style={styles.icon} />}
    </TouchableOpacity>
  );
};

export default Chip;
