import { useCallback } from 'react';
import { AppText, AppHeaderText, Clickable, SubHeaderLarge } from 'components';
import { TEmployeeEducation, TEmployeePastJob, TJobCompensation } from 'types';
import { isOdd, numberWithCommas } from 'utils';
import { useWindowDimensions } from 'hooks';
import UpRightArrowRed from 'assets/svgs/arrow_right_red.svg?react';
import UpRightArrowWhite from 'assets/svgs/arrow_right_white.svg?react';

import useStyles from './OpenModalItemStyles';

type OpenModalItemProps = {
  onClick: () => void;
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
  containerStyles?: React.CSSProperties;
  titleStyles?: React.CSSProperties;
  isError?: boolean;
  isAppText?: boolean;
};

const OpenModalItem = ({
  onClick,
  values,
  title,
  containerStyles,
  titleStyles,
  isError,
  isAppText,
}: OpenModalItemProps) => {
  const styles = useStyles(isError);
  const { windowWidth } = useWindowDimensions();

  const returnJobCompensationText = useCallback((values: TJobCompensation) => {
    let compString = `$${numberWithCommas(values?.payRange?.min)} - $${numberWithCommas(values.payRange?.max)} per ${
      values.type === 'Salary' ? 'year' : 'hour'
    }`;
    if (values.salaryConversionRange) {
      compString += ` or $${numberWithCommas(values?.salaryConversionRange?.min)} - $${numberWithCommas(
        values.salaryConversionRange?.max
      )} per year`;
    }
    return compString;
  }, []);

  const returnSkillsTrimBasedOnWindowWidth = () => {
    if (windowWidth > 1500) {
      return 70;
    } else if (windowWidth > 1300) {
      return 60;
    } else if (windowWidth > 1200) {
      return 50;
    } else {
      return 40;
    }
  };

  const returnStringsWithDots = useCallback(
    (stringArray: string[]) => {
      const valuesWithDots: string[] = [];
      // add dots in every even odd index of array
      stringArray.forEach((value: string, index: number) => {
        valuesWithDots.push(`${value}  `);

        // only add dot if its not the last one
        if (index + 1 != stringArray.length) {
          valuesWithDots.push(`,`);
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
            <div style={styles.circleContainer} key={index}>
              {index === valuesWithDots.length - 1 ? (
                <AppText style={styles.ellipsis}>{value}</AppText>
              ) : (
                <AppText style={styles.circle}>{value}</AppText>
              )}
            </div>
          );
        }
      });
    },
    [styles.circle, styles.circleContainer, styles.ellipsis, styles.valuesText]
  );

  const returnValuesToDisplay = useCallback(() => {
    if (values) {
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
        if (Array.isArray(values) && values.length > 0 && typeof values[0] === 'string') {
          if (values[0].length >= 50) {
            return values[0].substring(0, 50) + '...';
          } else {
            return values[0];
          }
        }
      } else if (typeof values === 'string' || typeof values === 'number') {
        return <AppText style={styles.valuesText}>{values.toString().substring(0, 70)}</AppText>;
      } else if (Array.isArray(values)) {
        // for some reason white space will be trimmed without
        // this arbitrary invisible character inbetween

        if (values.join(',').length >= returnSkillsTrimBasedOnWindowWidth()) {
          return values.join(', ‎ ').toString().substring(0, returnSkillsTrimBasedOnWindowWidth()) + '...';
        } else {
          return values.join(', ‎ ').toString();
        }
      }
    }
  }, [
    returnJobCompensationText,
    returnSkillsTrimBasedOnWindowWidth,
    returnStringsWithDots,
    styles.valuesText,
    title,
    values,
  ]);

  return (
    <Clickable style={{ ...styles.container, ...containerStyles }} onClick={onClick}>
      <div style={styles.titleSection}>
        {isAppText ? (
          <SubHeaderLarge textInputLabelStyle={{ ...styles.titleText, ...titleStyles }} text={title} />
        ) : (
          <AppHeaderText style={{ ...styles.titleText, ...titleStyles }}>{title}</AppHeaderText>
        )}
      </div>
      <div style={styles.locationAndArrowSection}>
        <div style={styles.valuesSection}>
          <AppText style={styles.valuesContainer} numberOfLines={1}>
            {returnValuesToDisplay()}
          </AppText>
        </div>
        <div style={styles.arrowContainer}>
          {isError ? (
            <UpRightArrowRed style={styles.upRightArrow} />
          ) : (
            <AppText numberOfLines={1} style={styles.upRightArrowContainer}>
              <UpRightArrowWhite style={{ paddingTop: '5px' }} />
            </AppText>
          )}
        </div>
      </div>
    </Clickable>
  );
};

export default OpenModalItem;
