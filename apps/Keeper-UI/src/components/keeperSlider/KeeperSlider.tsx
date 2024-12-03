import React, { useEffect, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { AppHeaderText, EditProfileTitle } from 'components';
import { useTheme } from 'theme/theme.context';

import useStyles from './KeeperSliderStyles';

type KeeperSliderProps = {
  title?: string;
  titleStyles?: StyleProp<TextStyle>;
  valueStyles?: StyleProp<TextStyle>;
  minimumValue: number;
  maximumValue: number;
  step: number;
  defaultValue?: number;
  transformValueFunction?: (value: number) => string;
  onSliderComplete: (value: number) => void;
};

const KeeperSlider = ({
  title,
  titleStyles,
  valueStyles,
  minimumValue,
  maximumValue,
  step,
  defaultValue,
  onSliderComplete,
  transformValueFunction,
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
      <View>
        {title && <EditProfileTitle text={title} textStyles={titleStyles} />}
        <AppHeaderText style={[styles.yearsOfExperienceText, valueStyles]}>
          {transformValueFunction ? transformValueFunction(localValue) : localValue}
        </AppHeaderText>
      </View>
      <Slider
        value={localValue}
        onValueChange={setLocalValue}
        onSlidingComplete={onSliderComplete}
        style={styles.slider}
        minimumTrackTintColor={theme.color.pink}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        thumbTintColor='white'
      />
    </>
  );
};

export default KeeperSlider;
