import React, { useCallback, useState } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { ChannelList } from 'screens';
import { AppBoldText, AppHeaderText, AppText } from 'components';
import { TMatch } from 'keeperTypes';
import { getMatchesContainerHeight } from 'projectUtils';
import { useDidMountEffect } from 'hooks';

import { useStyles } from './JobsBubbleStyles';
import ArrowDown from '../../assets/svgs/arrow-down.svg';
import ArrowUp from '../../assets/svgs/arrow-up.svg';

type TJobsBubble = {
  jobId: string | undefined;
  jobColor: string;
  jobTitle: string;
  jobImg: string;
  companyName: string;
  jobsMatches: TMatch[];
};

const baseHeight = 167;

const JobsBubble = ({ jobId, jobColor, jobTitle, companyName, jobsMatches }: TJobsBubble) => {
  const [isOpen, setIsOpen] = useState(true);
  const [height] = useState(new Animated.Value(getMatchesContainerHeight(jobsMatches.length, true)));

  const styles = useStyles(jobColor, height, jobTitle.length);

  useDidMountEffect(() => {
    open();
  }, [jobsMatches]);

  const open = useCallback(() => {
    Animated.spring(height, {
      toValue: getMatchesContainerHeight(jobsMatches.length, true),
      useNativeDriver: false,
    }).start();
    setIsOpen(true);
  }, [height, jobsMatches.length]);

  const close = useCallback(() => {
    Animated.spring(height, {
      toValue: baseHeight,
      speed: 5,
      useNativeDriver: false,
    }).start();
    setIsOpen(false);
  }, [height]);

  if (!jobId) {
    return;
  }

  return (
    <Animated.View style={styles.jobsMatchesContainer}>
      <TouchableOpacity style={styles.titleAndCompanyTouchable} onPress={isOpen ? close : open}>
        {isOpen ? <ArrowUp style={styles.arrowSvg} /> : <ArrowDown style={styles.arrowSvg} />}

        <AppHeaderText numberOfLines={2} style={styles.jobTitle}>
          {jobTitle}
        </AppHeaderText>
        <AppBoldText style={styles.companyName} numberOfLines={1}>
          {companyName}
        </AppBoldText>
      </TouchableOpacity>
      {isOpen && jobsMatches.length > 0 && <ChannelList matches={jobsMatches} isCandidateSort={false} />}
      {isOpen && jobsMatches.length === 0 && (
        <AppText style={styles.emptyMatchesText}>Continue connecting to get matches</AppText>
      )}
    </Animated.View>
  );
};

export default JobsBubble;
