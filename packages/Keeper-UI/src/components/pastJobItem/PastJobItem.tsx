// import { FontAwesome } from '@expo/vector-icons';
import { AppHeaderText, AppText } from 'components';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { TEmployeePastJob } from 'types';
import { isPastJobComplete } from 'utils';
import { Ionicons } from '@expo/vector-icons';

import { useStyles } from './PastJobItemStyles';
import ArrowRightRed from '../../assets/svgs/arrow_right_red.svg';
import ArrowRightWhite from '../../assets/svgs/arrow_right_white.svg';

type PastJobItemType = {
  job: TEmployeePastJob;
  jobHistoryLength: number;
  index: number;
  hasCheckBeenPressed?: boolean;
  onPress?: any;
  isWhite?: boolean;
  isJobHistoryScreen?: boolean;
  hasUploadedResume?: boolean;
};

const PastJobItem = ({
  onPress,
  job,
  jobHistoryLength,
  index,
  hasCheckBeenPressed,
  isWhite,
  isJobHistoryScreen,
  hasUploadedResume,
}: PastJobItemType) => {
  const [activeAccordions, setActiveAccordions] = useState<any>([]);

  const isComplete = !isJobHistoryScreen || isPastJobComplete(job, !!hasCheckBeenPressed, hasUploadedResume);

  const styles = useStyles(isWhite, !!isComplete);

  const onAccordionClick = useCallback(
    (i: number) => {
      // if already been clicked, remove from array else, add it in
      if (activeAccordions.includes(i)) {
        const index = activeAccordions.indexOf(i);
        if (index > -1) {
          const activeAccordionsCopy = activeAccordions;
          activeAccordionsCopy.splice(index, 1);
          setActiveAccordions([...activeAccordionsCopy]);
        }
      } else {
        setActiveAccordions([...activeAccordions, i]);
      }
    },
    [activeAccordions],
  );

  const returnIcon = () => {
    // isObjectFieldCompleted
    return activeAccordions?.includes(index) ? (
      <Ionicons name='arrow-up-circle-outline' style={styles.arrow} />
    ) : isWhite ? (
      isComplete ? (
        <Ionicons name='arrow-up-circle-outline' style={styles.arrow} />
      ) : (
        <ArrowRightRed style={styles.forwardIcon} />
      )
    ) : (
      <Ionicons name='arrow-down-circle-outline' style={styles.arrow} />
    );
  };

  // not sure why this function was made leaving it commented, doing nothing for now as tech debt
  function formatDateRange(input: string) {
    if (input === null) {
      return 'Present';
    } else {
      return input;
    }
  }

  return (
    <TouchableOpacity
      hitSlop={styles.hitSlop}
      key={index}
      onPress={() => (onPress ? onPress(index) : onAccordionClick(index))}>
      <View style={[styles.specificPastJob, index + 1 === jobHistoryLength ? styles.noBottomBorder : {}]}>
        <View style={styles.jobDetailsSection}>
          {/* <ArrowDown style={styles.forwardIcon} /> */}
          {!isJobHistoryScreen ? returnIcon() : <ArrowRightWhite style={styles.forwardIcon} />}

          <View style={styles.jobTitleContainer}>
            <AppHeaderText numberOfLines={2} style={styles.jobTitleText}>
              {job?.jobTitle}
            </AppHeaderText>
          </View>
          <AppText style={styles.companyText}>{job.company}</AppText>
          <AppText style={styles.jobMonthsText}>{job?.startDate + ' - ' + formatDateRange(job?.endDate)}</AppText>
          <View>
            {/* <AppText style={activeAccordions.includes(index) ? styles.companyName : styles.hidden}>
              {job?.company}
            </AppText> */}
            <AppText style={activeAccordions.includes(index) ? styles.jobDetailsOpened : styles.hidden}>
              {job?.jobDescription}
            </AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default PastJobItem;
