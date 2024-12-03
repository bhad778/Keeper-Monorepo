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
  transformValueFunction?: (value: number) => string;
  onSliderComplete: (value: number) => void;
};

const KeeperSlider = ({
  title,
  minimumValue,
  maximumValue,
  step,
  defaultValue,
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

  return (
    <>
      <>
        <Header text={title || ''} />
        <AppHeaderText style={styles.yearsOfExperienceText}>{localValue}</AppHeaderText>
      </>
      <Slider
        value={localValue}
        onChange={(event, newValue) => setLocalValue(newValue)}
        onChangeCommitted={(event, newValue) => {
          onSliderComplete(newValue);
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
