import React, { useCallback } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import { EditProfileTitle, KeeperTextInput } from 'components';

import { useStyles } from './DateInputStyles';

type TDateInput = {
  title: string;
  dateString: string;
  setDateString: (newDate: string) => void;
  isYear?: boolean;
  titleStyles?: StyleProp<TextStyle>;
  onFocus?: () => void;
};

const blankInput = '00/00';

const DateInput = ({ title, dateString, setDateString, isYear, titleStyles, onFocus }: TDateInput) => {
  const styles = useStyles();

  const returnGuidedDateInput = useCallback(
    (newDateString: string) => {
      let tempDateString = newDateString;
      //remove slashes
      tempDateString = tempDateString.replace(/\\|\//g, '');

      if (
        tempDateString.length === 1 &&
        tempDateString != '0' &&
        tempDateString != '1' &&
        newDateString.length > dateString.length
      ) {
        tempDateString = '0' + tempDateString;
      }
      if (tempDateString.length > 2) {
        tempDateString = tempDateString.slice(0, 2) + '/' + tempDateString.slice(2);
      }
      setDateString(tempDateString);
    },
    [setDateString],
  );

  return (
    <View style={styles.container}>
      <EditProfileTitle text={title} textStyles={titleStyles} />
      <KeeperTextInput
        value={dateString}
        onChangeText={isYear ? setDateString : returnGuidedDateInput}
        keyboardType='numeric'
        placeholder={isYear ? '0000' : blankInput}
        placeholderTextColor='white'
        maxLength={5}
        onFocus={onFocus}
      />
    </View>
  );
};

export default DateInput;
