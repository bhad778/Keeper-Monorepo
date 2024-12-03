import { TJobSettings } from 'keeperTypes';
import { numberWithCommas, toTitleCase } from 'utils';
import {
  AppText,
  KeeperSelectButton,
  Chip,
  KeeperImage,
  AppHeaderText,
  BackButton,
  SectionContainer,
  Clickable,
  AppBoldText,
} from 'components';
import Grid from '@mui/material/Grid';
import { useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useRef } from 'react';
import CircleIcon from '@mui/icons-material/Circle';
import toast from 'react-hot-toast';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';
import IosShareIcon from '@mui/icons-material/IosShare';

import { useStyles } from './JobPostingComponentStyles';

type JobPostingComponentProps = {
  currentJobSettings: TJobSettings;
  currentJobId?: string;
  swipe?: (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => void;
  isOwner?: boolean;
  isFromEdit?: boolean;
  onBackClick?: () => void;
  setLikedCard?: (liked: boolean) => void;
  isNew?: boolean;
  isModal?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
};

// this is the reusable component that is in both ViewResume and
// Resume files it contains the shared logic and html between them
const JobPostingComponent = ({
  currentJobSettings,
  currentJobId,
  swipe,
  setLikedCard,
  onBackClick,
  // isOwner means this is a logged in employee viewing their own resume
  isOwner,
  isFromEdit,
  isNew,
  isModal,
  onLike,
  onDislike,
}: JobPostingComponentProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const isEmployee = accountType === 'employee';

  const styles = useStyles(isOwner, isModal);
  const containerRef = useRef(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    containerRef?.current?.scrollTo(0, 0);
  }, [currentJobSettings]);

  // const returnProfilePicture = () => {
  //   return (
  //     <KeeperImage
  //       style={styles.profilePicture}
  //       source={currentJobSettings?.img || ''}
  //     />
  //   );
  // };

  const returnRequiredSkillsChips = (relevantSkills: string[]) => {
    return relevantSkills.map((skill: string) => <Chip name={skill} key={skill} />);
  };

  const returnKeyResponsibilities = (responsibilities: string[]) => {
    return responsibilities.map((responsibility: string, index: number) => (
      <div style={styles.responsibility} key={index}>
        <div style={styles.arrowContainer}>
          <CircleIcon sx={styles.rightArrow} />
        </div>
        <AppText>{responsibility}</AppText>
      </div>
    ));
  };

  const onKeepButtonPress = (isLike: boolean) => {
    if (swipe) {
      swipe(isLike, currentJobId || '');
    }
    if (setLikedCard) {
      setLikedCard(isLike);
    }
  };

  const onNextPress = () => {
    if (swipe) {
      swipe(false, currentJobId || '', true);
    }
  };

  const returnCompensationString = () => {
    return `$${numberWithCommas(currentJobSettings?.compensation?.payRange?.min)} - $${numberWithCommas(
      currentJobSettings?.compensation?.payRange?.max,
    )} ${currentJobSettings.compensation?.type === 'Salary' ? 'yearly' : 'hourly'}`;
  };

  const onShareClick = () => {
    navigator.clipboard.writeText('https://keepertechjobs.io/browse/discover/dev/5/react/' + currentJobId);
    toast.success(`Copied Link to Clipboard`);
  };

  return (
    <Grid container spacing={isSmallScreen ? 0 : 8} style={styles.jobPostingContainer} ref={containerRef}>
      <Clickable style={styles.shareClickable} onClick={onShareClick}>
        <AppBoldText>Share</AppBoldText>
        <IosShareIcon sx={styles.shareIcon} />
      </Clickable>

      <Grid item style={styles.grid1} sm={12} md={4.6} xl={4}>
        {!isNew && !isEmployee && (
          <BackButton
            onClick={onBackClick}
            backText={`Back to ${isFromEdit ? 'Edit Job' : 'Job Board'}`}
            containerStyles={styles.backButtonContainer}
            textStyles={styles.backTextStyles}
          />
        )}
        <div style={styles.pictureAndInfoContainer}>
          {currentJobSettings?.img ? (
            <div style={styles.profilePicContiainer}>
              <KeeperImage style={styles.profilePicture} source={currentJobSettings?.img || ''} resizeMode='contain' />
            </div>
          ) : (
            <div style={styles.emptyCompanyLogoContainer}>
              <AppText style={styles.companyLogoText}>COMPANY LOGO</AppText>
            </div>
          )}

          <AppHeaderText
            style={{
              ...styles.jobTitleText,
            }}>
            {`${currentJobSettings?.title}`}
          </AppHeaderText>
          <AppHeaderText
            style={{
              ...styles.companyName,
            }}>
            {`${currentJobSettings?.companyName}`}
          </AppHeaderText>
          <AppText style={{ ...styles.position, ...styles.text }}>{returnCompensationString()}</AppText>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {returnRequiredSkillsChips(currentJobSettings?.relevantSkills)}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
              marginBottom: 10,
            }}>
            <AppText style={styles.addressText}>{toTitleCase(currentJobSettings?.address || '')}</AppText>
            <AppText style={styles.addressText}>{currentJobSettings?.onSiteSchedule}</AppText>
          </div>
        </div>
        {!isOwner && (
          <>
            <KeeperSelectButton
              buttonStyles={styles.keepButtonLike}
              textStyles={styles.keepButtonTextLike}
              onClick={onLike ? onLike : () => onKeepButtonPress(true)}
              title={'Like'}
            />

            <KeeperSelectButton
              buttonStyles={styles.keepButtonLike}
              textStyles={styles.keepButtonTextLike}
              onClick={onDislike ? onDislike : () => onKeepButtonPress(false)}
              title={'Pass'}
            />
          </>
        )}
      </Grid>
      <Grid item style={styles.grid2} sm={12} md={7.4} xl={8}>
        <SectionContainer>
          <AppHeaderText>Company Description</AppHeaderText>
          <AppText>{currentJobSettings?.companyDescription}</AppText>
        </SectionContainer>

        <SectionContainer>
          <AppHeaderText>The Role</AppHeaderText>
          <AppText>{currentJobSettings.jobOverview}</AppText>
        </SectionContainer>

        <SectionContainer>
          <AppHeaderText style={{ ...styles.skillsTitle, ...styles.text }}>You're A Fit If</AppHeaderText>
          <div style={styles.skillsListSection}>{returnKeyResponsibilities(currentJobSettings?.jobRequirements)}</div>
        </SectionContainer>

        <SectionContainer>
          <AppHeaderText style={styles.educationTitle}>Benefits</AppHeaderText>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {currentJobSettings?.benefits?.map((benefit: any, index: number) => {
              return (
                <div key={index}>
                  <AppText
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {benefit}
                    <div
                      style={
                        index === currentJobSettings?.benefits?.length - 1 ? styles.hidden : styles.bulletPoint
                      }></div>
                  </AppText>
                </div>
              );
            })}
          </div>
        </SectionContainer>
      </Grid>
    </Grid>
  );
};

export default JobPostingComponent;
