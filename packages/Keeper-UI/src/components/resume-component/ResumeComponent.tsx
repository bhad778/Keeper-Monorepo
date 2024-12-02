import React, { memo, useCallback } from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { TEmployeeEducation, TEmployeePastJob, TEmployeeSettings } from 'types';
import { toTitleCase } from 'utils';
import { PastJobItem, AppText, Chip, KeeperImage, EducationListItem, AppHeaderText } from 'components';
import { useReorderJobHistory } from 'hooks';

import ProfileImgPlaceholder from '../../assets/svgs/profile_img_placeholder.svg';
import { useStyles } from './ResumeComponentStyles';

type ResumeComponentProps = {
  currentEmployeeSettings: TEmployeeSettings;
  isOwner?: boolean;
  jobColor?: string;
};

// this is the reusable component that is in both ViewResume and
// Resume files it contains the shared logic and html between them
const ResumeComponent = ({
  currentEmployeeSettings,
  // isOwner means this is a logged in employee viewing their own resume
  isOwner,
  jobColor,
}: ResumeComponentProps) => {
  const styles = useStyles(
    isOwner,
    currentEmployeeSettings?.jobHistory && currentEmployeeSettings?.jobHistory?.length === 0,
    jobColor,
  );
  const { reorderedJobHistory } = useReorderJobHistory(currentEmployeeSettings?.jobHistory);

  const returnProfilePicture = useCallback(() => {
    if (isOwner && !currentEmployeeSettings?.img) {
      return (
        <View style={styles.profilePictureEmpty}>
          <AppText>Add a profile picture</AppText>
          <Icon name='plus' size={40} color='black' />
        </View>
      );
    } else {
      if (currentEmployeeSettings?.img === 'empty') {
        return <ProfileImgPlaceholder style={styles.profileImgPlaceholder} />;
      }

      return (
        <KeeperImage
          style={styles.profilePicture}
          source={{
            uri: currentEmployeeSettings?.img,
          }}
        />
      );
    }
  }, [
    isOwner,
    currentEmployeeSettings?.img,
    styles.profilePictureEmpty,
    styles.profilePicture,
    styles.profileImgPlaceholder,
  ]);

  return (
    <View style={styles.resumeComponentContainer}>
      <View style={styles.section}>
        <AppHeaderText style={[styles.name, styles.text]}>{currentEmployeeSettings?.firstName}</AppHeaderText>
        <AppHeaderText style={[styles.position, styles.text]}>
          {toTitleCase(currentEmployeeSettings?.jobTitle || '')}
        </AppHeaderText>
      </View>

      <View style={styles.section}>{returnProfilePicture()}</View>

      <View style={styles.section}>
        <AppText style={[styles.aboutMeText, styles.text]}>{currentEmployeeSettings?.aboutMeText}</AppText>
      </View>

      <View style={styles.section}>
        {currentEmployeeSettings?.jobHistory && currentEmployeeSettings?.jobHistory?.length > 0 && (
          <>
            <View style={styles.jobHistoryTitleSection}>
              <AppHeaderText style={[styles.sectionTitle, styles.text]}>Job History</AppHeaderText>
            </View>
            <View>
              {reorderedJobHistory &&
                reorderedJobHistory.map((job: TEmployeePastJob, index: number) => (
                  <PastJobItem job={job} index={index} key={index} jobHistoryLength={reorderedJobHistory.length} />
                ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.section}>
        <AppHeaderText style={[styles.sectionTitle, styles.text]}>Skills</AppHeaderText>
        <View style={styles.skillsListSection}>
          {currentEmployeeSettings?.relevantSkills?.map((skill: any, i: number) => (
            <View key={i} style={styles.skillsContainer}>
              <Chip containerStyles={styles.chipContainer} textStyles={styles.chipText} name={skill} key={skill} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <AppHeaderText style={styles.sectionTitle}>Education</AppHeaderText>
        {currentEmployeeSettings?.educationHistory?.map((educationItem: TEmployeeEducation, index: number) => {
          return <EducationListItem educationItem={educationItem} index={index} key={educationItem.uuid} />;
        })}
      </View>
    </View>
  );
};

export default memo(ResumeComponent);
