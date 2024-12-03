import { TEmployeeEducation, TEmployeePastJob, TEmployeeSettings } from 'keeperTypes';
import { toTitleCase } from 'utils';
import { useEffect, useRef } from 'react';
import {
  PastJobItem,
  AppText,
  KeeperSelectButton,
  Chip,
  KeeperImage,
  EducationListItem,
  AppHeaderText,
  Header,
  SectionContainer,
  AppBoldText,
  Clickable,
} from 'components';
import { useReorderJobHistory } from 'hooks';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxStore';
import Grid from '@mui/material/Grid';
import { useMediaQuery, useTheme } from '@mui/material';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import IosShareIcon from '@mui/icons-material/IosShare';
import ProfileImgPlaceholder from 'assets/svgs/profile_img_placeholder.svg?react';

import { useStyles } from './ResumeComponentStyles';

type ResumeComponentProps = {
  currentEmployeeSettings: TEmployeeSettings;
  currentEmployeeId?: string;
  onBackClick?: () => void;
  swipe?: (isRightSwipe: boolean, currentItemId: string, isNextSwipe?: boolean) => void;
  setLikedCard?: (liked: boolean) => void;
  isOwner?: boolean;
  jobColor?: string;
  isNew?: boolean;
  isModal?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
};

// this is the reusable component that is in both ViewResume and
// Resume files it contains the shared logic and html between them
const ResumeComponent = ({
  currentEmployeeSettings,
  currentEmployeeId,
  swipe,
  setLikedCard,
  // isOwner means this is a logged in employee viewing their own resume
  isOwner,
  isNew,
  isModal,
  onLike,
  onDislike,
}: ResumeComponentProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const selectedJobId = useSelector((state: RootState) => state.local.selectedJob._id);

  const containerRef = useRef(null);
  const theme = useTheme();
  const location = useLocation();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const isViewResume = location.pathname.includes('viewResume');
  const isEmployee = accountType === 'employee';

  const shouldTextBeWhite = (isNew && !isEmployee) || isEmployee || isOwner || isModal;

  const styles = useStyles(!!isOwner, isEmployee, isModal, !!selectedJobId);
  const { reorderedJobHistory } = useReorderJobHistory(currentEmployeeSettings?.jobHistory);

  useEffect(() => {
    containerRef?.current?.scrollTo(0, 0);
  }, [currentEmployeeSettings]);

  const returnProfilePicture = () => {
    if (!currentEmployeeSettings?.img) {
      return (
        <div style={styles.profileImgPlaceholderStyles}>
          <ProfileImgPlaceholder style={styles.profileImgPlaceholder} />
        </div>
      );
    }

    return <KeeperImage style={styles.profilePicture} source={currentEmployeeSettings?.img} resizeMode='cover' />;
  };

  const borderInbetween = (arrayLength: number, index: number) => {
    if (arrayLength === 1) {
      return {};
    } else {
      return arrayLength - 1 === index ? {} : { borderBottom: '2px solid white' };
    }
  };

  const onKeepButtonPress = (isLike: boolean) => {
    if (swipe) {
      swipe(isLike, currentEmployeeId || '');
      if (setLikedCard) {
        setLikedCard(isLike);
      }
    }
  };

  const onNextPress = () => {
    if (swipe) {
      swipe(false, currentEmployeeId || '', true);
    }
  };

  const onShareClick = () => {
    navigator.clipboard.writeText('https://keepertechjobs.io/browse/discover/recruiter/5/react/' + currentEmployeeId);
    toast.success(`Copied Link to Clipboard`);
  };

  return (
    <Grid container spacing={isSmallScreen ? 0 : 4} style={styles.resumeComponentContainer} ref={containerRef}>
      <Clickable style={styles.shareClickable} onClick={onShareClick}>
        <AppBoldText style={styles.shareText}>Share</AppBoldText>
        <IosShareIcon sx={styles.shareIcon} />
      </Clickable>

      <Grid item style={styles.grid1} md={4.5} xl={4}>
        <div style={styles.profilePicContainer}>
          {returnProfilePicture()}
          <Header textInputLabelStyle={styles.resumeHeaderText} text={`${currentEmployeeSettings?.firstName}`} />
          <AppText style={{ ...styles.position, ...styles.text }}>
            {toTitleCase(currentEmployeeSettings?.jobTitle || '')}
          </AppText>
          <AppText style={{ ...styles.addressText, ...styles.text }}>
            {toTitleCase(currentEmployeeSettings?.address || '')}
          </AppText>
        </div>
        {!isOwner && (
          <>
            <KeeperSelectButton
              buttonStyles={styles.keepButtonLike}
              textStyles={styles.keepButtonTextLike}
              onClick={onLike ? onLike : () => onKeepButtonPress(true)}
              title={`Like ${currentEmployeeSettings?.firstName}`}
            />
            <KeeperSelectButton
              buttonStyles={styles.keepButtonLike}
              textStyles={styles.keepButtonTextLike}
              onClick={onDislike ? onDislike : () => onKeepButtonPress(false)}
              title={`Pass On ${currentEmployeeSettings?.firstName}`}
            />
          </>
        )}
        <div style={styles.onSiteOptionsToContainer}>
          <AppBoldText>Open To:</AppBoldText>
          <AppText style={{ ...styles.addressText, ...styles.text }}>
            {currentEmployeeSettings?.onSiteOptionsOpenTo?.join(' / ')}
          </AppText>
        </div>
        <div style={styles.onSiteOptionsToContainer}>
          <AppBoldText>Preferred Company Size:</AppBoldText>
          <AppText style={{ ...styles.addressText, ...styles.text }}>
            {currentEmployeeSettings?.companySizeOptionsOpenTo?.join(' / ')}
          </AppText>
        </div>
        <div style={styles.onSiteOptionsToContainer}>
          <AppBoldText>Preferred Stack Options:</AppBoldText>
          <AppText style={{ ...styles.addressText, ...styles.text }}>
            {currentEmployeeSettings?.frontendBackendOptionsOpenTo?.join(' / ')}
          </AppText>
        </div>
      </Grid>
      <Grid item style={styles.grid2} md={7.4} xl={8}>
        <SectionContainer>
          <Header textInputLabelStyle={styles.resumeHeaderText} text='About Me' />
          <AppText style={{ ...styles.aboutMeText, ...styles.text }}>{currentEmployeeSettings?.aboutMeText}</AppText>
        </SectionContainer>
        <SectionContainer>
          {currentEmployeeSettings?.jobHistory && currentEmployeeSettings?.jobHistory?.length > 0 && (
            <>
              <Header textInputLabelStyle={styles.resumeHeaderText} text='Job History' />
              {reorderedJobHistory &&
                reorderedJobHistory.map((job: TEmployeePastJob, index: number) => (
                  <PastJobItem
                    shouldTextBeWhite={shouldTextBeWhite}
                    jobHistoryLength={reorderedJobHistory.length}
                    isSmallScreen={isSmallScreen}
                    isWhite={isEmployee || isViewResume || !!shouldTextBeWhite}
                    job={job}
                    index={index}
                    key={index}
                  />
                ))}
            </>
          )}
        </SectionContainer>

        <SectionContainer>
          <Header text='Skills' textInputLabelStyle={styles.resumeHeaderText} />

          <div style={styles.skillsListSection}>
            {currentEmployeeSettings?.relevantSkills?.map((skill: any, i: number) => (
              <div key={i} style={styles.skillContainer}>
                <Chip textStyles={styles.chipText} name={skill} key={skill} />
              </div>
            ))}
          </div>
        </SectionContainer>
        <SectionContainer>
          <AppHeaderText style={{ ...styles.educationTitle, ...styles.text }}>Education</AppHeaderText>
          {currentEmployeeSettings?.educationHistory?.map((educationItem: TEmployeeEducation, index: number) => {
            return (
              <div
                key={index}
                style={{
                  ...{ paddingTop: 15, paddingBottom: 15 },
                  ...borderInbetween(currentEmployeeSettings?.educationHistory?.length, index),
                }}>
                <EducationListItem
                  isSmallScreen={isSmallScreen}
                  educationItem={educationItem}
                  index={index}
                  textColor='white'
                />
              </div>
            );
          })}
        </SectionContainer>
      </Grid>
    </Grid>
  );
};

export default ResumeComponent;
