import { ChangeEvent } from 'react';
import { Header, KeeperTextInput } from 'components';

import { useStyles } from './DateInputStyles';

type TDateInput = {
  title: string;
  dateString: string;
  setDateString: (newDateString: string) => void;
  isYear?: boolean;
  titleStyles?: any;
  onFocus?: () => void;
};

const blankInput = '00/00';

const DateInput = ({ title, dateString, setDateString, isYear, titleStyles, onFocus }: TDateInput) => {
  const styles = useStyles();

  const returnGuidedDateInput = (tempDateString: string) => {
    //remove slashes
    tempDateString = tempDateString.replace(/\\|\//g, '');

    if (
      tempDateString.length === 1 &&
      tempDateString != '0' &&
      tempDateString != '1' &&
      tempDateString.length > dateString.length
    ) {
      tempDateString = '0' + tempDateString;
    }
    if (tempDateString.length > 2) {
      tempDateString = tempDateString.slice(0, 2) + '/' + tempDateString.slice(2);
    }
    setDateString(tempDateString);
  };

  const setDateForYearType = (tempDateString: string) => {
    setDateString(tempDateString);
  };

  return (
    <div style={styles.container}>
      <Header text={title} textInputLabelStyle={titleStyles} />
      <KeeperTextInput
        value={dateString}
        onChange={isYear ? setDateForYearType : returnGuidedDateInput}
        keyboardType="numeric"
        placeholder={isYear ? '0000' : blankInput}
        maxLength={isYear ? 4 : 5}
        onFocus={onFocus}
      />
    </div>
  );
};

export default DateInput;
