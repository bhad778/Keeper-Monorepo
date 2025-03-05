import { useEffect, useState } from 'react';
import { AppHeaderText, Header } from 'components';
import { useTheme } from 'theme/theme.context';
import { Slider } from '@mui/material';

import useStyles from './KeeperSliderStyles';

type KeeperSliderProps = {
  title?: string;
  minimumValue: number;
  maximumValue: number;
  step: number;
  defaultValue?: number;
  formatDisplayValue?: (value: number) => string;
  onSliderComplete: (value: number) => void;
};

const KeeperSlider = ({
  title,
  minimumValue,
  maximumValue,
  step,
  defaultValue,
  formatDisplayValue,
  onSliderComplete,
}: KeeperSliderProps) => {
  const [localValue, setLocalValue] = useState(defaultValue || 0);

  const { theme } = useTheme();
  const styles = useStyles();

  useEffect(() => {
    if (typeof defaultValue !== 'undefined') {
      setLocalValue(defaultValue);
    }
  }, [defaultValue]);

  const displayValue = formatDisplayValue ? formatDisplayValue(localValue) : localValue;

  return (
    <>
      <>
        <Header text={title || ''} />
        <AppHeaderText style={styles.yearsOfExperienceText}>{displayValue}</AppHeaderText>
      </>
      <Slider
        value={localValue}
        onChange={(event, newValue) => setLocalValue(newValue as number)}
        onChangeCommitted={(event, newValue) => {
          onSliderComplete(newValue as number);
        }}
        style={styles.slider}
        sx={{
          '& .MuiSlider-thumb': {
            color: 'white',
          },
          '& .MuiSlider-track': {
            color: theme.color.pink,
          },
          '& .MuiSlider-rail': {
            color: theme.color.keeperGrey,
          },
        }}
        marks
        min={minimumValue}
        max={maximumValue}
        step={step}
      />
    </>
  );
};

export default KeeperSlider;
