import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, addLoggedInUser, updateResumeData } from 'reduxStore';
import { AppHeaderText, SpinnerOverlay, Match, Clickable } from 'components';
import { TCoreSignalUserData } from 'types/employeeTypes';
import { genericErrorMessage, jobColors } from 'constants/globalConstants';
import { coreSignalResumeTransformer } from 'utils';
import { UsersService } from 'services';
import toast from 'react-hot-toast';

import useStyles from './ViewCoreSignalUsersStyles';

type ViewCoreSignalUsersProps = {
  coreSignalUsers: TCoreSignalUserData[];
};

const ViewCoreSignalUsers = ({ coreSignalUsers }: ViewCoreSignalUsersProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const styles = useStyles();

  const onSelectUserClick = useCallback(
    async (user: TCoreSignalUserData) => {
      setIsLoading(true);

      const updatedResumeData = coreSignalResumeTransformer(user);

      // call function to transform data, then set it in redux,
      // the employeeProfileScreen changes screens based on if hasGottenToEditProfileScreen exists
      dispatch(updateResumeData(updatedResumeData));
      dispatch(addLoggedInUser({ hasGottenToEditProfileScreen: true }));

      // update backend with hasGottenToEditProfileScreen
      UsersService.updateUserData({
        userId: loggedInUserId || '',
        accountType: 'employee',
        updateObject: { hasGottenToEditProfileScreen: true },
      });

      // update backend with updatedResume from core signal
      const updateObject = {
        userId: loggedInUserId || '',
        accountType: 'employee',
        lastUpdatedOnWeb: true,
        isIncomplete: true,
        newSettings: updatedResumeData,
      };
      UsersService.updateUserSettings(updateObject);

      setIsLoading(false);
    },
    [dispatch, loggedInUserId]
  );

  const skipCoreSignal = async () => {
    try {
      setIsLoading(true);
      // update backend with hasGottenToEditProfileScreen
      await UsersService.updateUserData({
        userId: loggedInUserId || '',
        accountType: 'employee',
        updateObject: { hasGottenToEditProfileScreen: true },
      });
      dispatch(addLoggedInUser({ hasGottenToEditProfileScreen: true }));
    } catch (error) {
      toast.error(genericErrorMessage);
      console.error('error: ', error);
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      {isLoading && <SpinnerOverlay />}

      <AppHeaderText style={styles.headerText}>Select your profile.</AppHeaderText>
      <div style={styles.matchesContainer}>
        {coreSignalUsers.map((user: TCoreSignalUserData, index: number) => {
          return (
            <Match
              key={index}
              text={user.summary}
              img={user.logo_url}
              title={user.name}
              color={jobColors[index]}
              isEmployee={true}
              isCandidateSort={true}
              onPress={() => onSelectUserClick(user)}
            />
          );
        })}
      </div>

      <Clickable onClick={skipCoreSignal} style={styles.bottomTextContainer}>
        <AppHeaderText style={styles.dontSeeProfileText}>Don't see your profile?</AppHeaderText>

        <AppHeaderText style={styles.bottomText}>Click here to fill out profile manually.</AppHeaderText>
      </Clickable>
    </div>
  );
};

export default ViewCoreSignalUsers;
