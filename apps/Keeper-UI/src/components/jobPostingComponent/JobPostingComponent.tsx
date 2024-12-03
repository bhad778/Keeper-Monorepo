/* eslint-disable no-undef */
import React from 'react';
import { View } from 'react-native';
import { AppText, Chip, AppBoldText, KeeperImage, AppHeaderText } from 'components';
import { TJobSettings } from 'keeperTypes';
import { numberWithCommas } from 'projectUtils';
import Entypo from 'react-native-vector-icons/Entypo';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import Svg, { Polygon } from 'react-native-svg'; // Import SVG components

import { useStyles } from './JobPostingComponentStyles';

type JobPostingComponentProps = {
  currentJobSettings: TJobSettings;
};

const JobPostingComponent = ({ currentJobSettings }: JobPostingComponentProps) => {
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);

  const isBrowsing = !isLoggedIn || isEmployeeNew;

  const styles = useStyles(isBrowsing);

  const returnRequiredSkillsChips = (relevantSkills: string[]) => {
    return relevantSkills.map((skill: string) => <Chip name={skill} key={skill} />);
  };

  const returnKeyResponsibilities = (responsibilities: string[]) => {
    return responsibilities.map((responsibility: string, index: number) => (
      <View style={styles.responsibility} key={index}>
        <View style={styles.arrowContainer}>
          <Svg width={15} height={15} viewBox='0 0 40.18 40.18'>
            <Polygon
              fill='white' // Change this color to white
              points='35.18 8.67 35.18 31.64 3.54 0 0 3.54 31.64 35.18 8.67 35.18 8.67 40.18 40.18 40.18 40.18 8.67 35.18 8.67'
            />
          </Svg>
        </View>
        <View>
          <AppText style={styles.dailyResponsibilityText}>{responsibility}</AppText>
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.jobPostingContent}>
      <View>
        {currentJobSettings?.img ? (
          <KeeperImage
            style={styles.companyLogo}
            resizeMode='contain'
            source={{
              uri: currentJobSettings?.img,
            }}
          />
        ) : (
          <View style={styles.emptyCompanyLogoContainer}>
            <AppText style={styles.companyLogoText}>COMPANY LOGO</AppText>
          </View>
        )}
      </View>
      <View style={styles.topSection}>
        <View style={styles.jobTitleSection}>
          <View>
            <AppHeaderText style={styles.jobTitle}>{currentJobSettings?.title}</AppHeaderText>
            <AppBoldText style={styles.companyName}>at {currentJobSettings?.companyName}</AppBoldText>
            {/* <AppBoldText style={styles.jobTitle}>{currentJobSettings?.companyName?.toUpperCase()}</AppBoldText> */}
            <AppText style={styles.salaryOrHourlyText}>
              ${numberWithCommas(currentJobSettings?.compensation?.payRange?.min)} - $
              {numberWithCommas(currentJobSettings?.compensation?.payRange?.max)} / Year
            </AppText>
            {/* <AppBoldText style={styles.onSiteScheduleText}>{currentJobSettings?.onSiteSchedule}</AppBoldText> */}

            <View style={styles.requiredSkillsContainer}>
              {returnRequiredSkillsChips(currentJobSettings?.relevantSkills || [])}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.bottomHalfContainer}>
        <View style={styles.onSiteAddressContainer}>
          <AppText style={styles.isFullTimeText}>{currentJobSettings?.onSiteSchedule}</AppText>
          <View style={styles.locationContainer}>
            <Entypo color='white' name='location-pin' size={20} />
            <AppText style={styles.isFullTimeText}>{currentJobSettings?.address}</AppText>
          </View>
        </View>

        <View style={styles.section}>
          <AppHeaderText style={styles.appHeaderText}>The Company</AppHeaderText>
          <View>
            <AppText>{currentJobSettings?.companyDescription}</AppText>
          </View>
        </View>

        <View style={[styles.section, styles.whiteBubble]}>
          <AppHeaderText style={styles.theRoleText}>The Role</AppHeaderText>
          <AppText style={styles.theRoleContentText}>{currentJobSettings?.jobOverview}</AppText>
        </View>

        <View style={styles.section}>
          <AppHeaderText style={styles.appHeaderText}>You&apos;re a fit if</AppHeaderText>
          {returnKeyResponsibilities(currentJobSettings?.jobRequirements || [])}
        </View>
        {/* <View>
          <View style={styles.whoWeAreSection}>
            <AppBoldText style={styles.theRoleText}>YOU&apos;RE A FIT IF...</AppBoldText>
            {returnJobRequirements(currentJobSettings?.jobRequirements || [])}
          </View>
        </View> */}

        <AppHeaderText style={styles.appHeaderText}>Benefits</AppHeaderText>
        <View style={styles.skillsSection}>
          <View style={styles.skillsListSection}>
            {currentJobSettings?.benefits?.map((benefit, i) => (
              <View key={i} style={styles.skillContainer}>
                <AppText style={styles.skillText}>{benefit}</AppText>
                <View
                  style={i === currentJobSettings?.benefits?.length - 1 ? styles.hidden : styles.bulletPoint}></View>
              </View>
            ))}
          </View>
        </View>
        {/* {!isOwner && !isBrowsing && (
          <View style={styles.keepButtonContainer}>
            <KeeperSelectButton
              buttonStyles={[styles.keepButton, styles.likeThisJobButton]}
              textStyles={styles.keepButtonText}
              onPress={() => onKeepButtonPress(true)}
              title='LIKE THIS JOB'
            />
            <KeeperSelectButton
              buttonStyles={styles.keepButton}
              textStyles={styles.keepButtonText}
              onPress={() => onKeepButtonPress(false)}
              title='PASS ON THIS JOB'
            />
          </View>
        )} */}
      </View>
    </View>
  );
};

export default JobPostingComponent;
