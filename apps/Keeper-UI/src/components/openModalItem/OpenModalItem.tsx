import React, { memo, useCallback } from 'react';
import { StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AppBoldText, AppText } from 'components';
import { TEmployeeEducation, TEmployeePastJob, TJobCompensation } from 'keeperTypes';
import { isOdd, numberWithCommas } from 'projectUtils';

import useStyles from './OpenModalItemStyles';
import UpRightArrowWhite from '../../assets/svgs/arrow_right_white.svg';
import UpRightArrowRed from '../../assets/svgs/arrow_right_red.svg';

type OpenModalItemProps = {
  onPress: () => void;
  values:
    | string
    | string[]
    | number
    | TJobCompensation
    | TEmployeePastJob[]
    | TEmployeeEducation[]
    | boolean
    | undefined;
  title: string;
  containerStyles?: StyleProp<ViewStyle>;
  location?: boolean;
  titleStyles?: StyleProp<TextStyle>;
  isError?: boolean;
  isAppText?: boolean;
};

const OpenModalItem = ({
  onPress,
  values,
  title,
  containerStyles,
  location,
  titleStyles,
  isError,
  isAppText,
}: OpenModalItemProps) => {
  const styles = useStyles(isError, location);

  const returnJobCompensationText = useCallback((values: TJobCompensation) => {
    let compString = `$${numberWithCommas(values?.payRange?.min)} - $${numberWithCommas(values.payRange?.max)} per ${
      values.type === 'Salary' ? 'year' : 'hour'
    }`;
    if (values.salaryConversionRange) {
      compString += ` or $${numberWithCommas(values?.salaryConversionRange?.min)} - $${numberWithCommas(
        values.salaryConversionRange?.max,
      )} per year`;
    }
    return compString;
  }, []);

  const returnStringsWithDots = useCallback(
    (stringArray: string[]) => {
      const valuesWithDots: string[] = [];
      // add dots in every even odd index of array
      stringArray.forEach((value: string, index: number) => {
        valuesWithDots.push(`${value}  `);
        // only add dot if its not the last one
        if (index + 1 != stringArray.length) {
          valuesWithDots.push(`●    `);
        }
      });
      return valuesWithDots.map((value: string, index: number) => {
        if (!isOdd(index) || index === 0) {
          return (
            <AppText style={styles.valuesText} key={index}>
              {value}
            </AppText>
          );
        } else {
          return (
            <View style={styles.circleContainer} key={index}>
              <AppText style={styles.circle}>{value}</AppText>
            </View>
          );
        }
      });
    },
    [styles.circle, styles.circleContainer, styles.valuesText],
  );

  const returnValuesToDisplay = useCallback(() => {
    if (values || values === 0) {
      if (title === 'Required Years of Experience') {
        return <AppText style={styles.valuesText}>{`${values} years`}</AppText>;
      } else if (title === 'Compensation') {
        return <AppText style={styles.valuesText}>{returnJobCompensationText(values as TJobCompensation)}</AppText>;
      } else if (title === 'Job History') {
        const tempValues = values as TEmployeePastJob[] | true;
        // if Job History values come in as true, that means user has selected they have no job history
        if (typeof tempValues === 'boolean') {
          return 'Seeking First Tech Job';
        } else {
          const jobTitlesArray = tempValues.map((pastJob: TEmployeePastJob) => pastJob.company);
          return returnStringsWithDots(jobTitlesArray);
        }
      } else if (title === 'Education') {
        const tempValues = values as TEmployeeEducation[];
        const schoolsArray = tempValues.map((educationItem: TEmployeeEducation) => educationItem.school);
        return returnStringsWithDots(schoolsArray);
      } else if (title === `You're a Fit if...`) {
        if (Array.isArray(values) && values.length > 0) {
          return values[0];
        }
      } else if (typeof values === 'string' || typeof values === 'number') {
        return <AppText style={styles.valuesText}>{values}</AppText>;
      } else if (Array.isArray(values)) {
        return returnStringsWithDots(values as string[]);
      }
    }
  }, [returnJobCompensationText, returnStringsWithDots, styles.valuesText, title, values]);

  return (
    <TouchableOpacity style={[styles.container, containerStyles]} onPress={onPress}>
      <View style={styles.titleAndIconSection}>
        {isAppText ? (
          <AppText style={[styles.titleText, titleStyles]}>{title}</AppText>
        ) : (
          <AppBoldText style={[styles.titleText, titleStyles]}>{title}</AppBoldText>
        )}
        {isError ? <UpRightArrowRed style={styles.upRightArrow} /> : <UpRightArrowWhite style={styles.upRightArrow} />}
      </View>
      <View style={{ height: 200, paddingTop: 10 }}>
        <View style={styles.valuesSection}>
          <AppText style={styles.valuesContainer} numberOfLines={1}>
            {returnValuesToDisplay()}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(OpenModalItem);
