import { EditEmployee, ResumeComponent, BannerWhite, KeeperSelectButton } from 'components';
import { RootState } from 'reduxStore/store';
import { useSelector } from 'react-redux';
import { Dispatch, SetStateAction, useState } from 'react';
import { TJob } from 'types';

import useStyles from './EditProfileScreenStyles';

type ProfileScrenProps = {
  isPreview?: boolean;
  employerProps?: {
    jobColor?: string;
    selectedJobForMenu: TJob | undefined;
    setNewSubmittedJob?: Dispatch<SetStateAction<TJob | undefined>>;
    onBackClick: () => void;
  };
};

const EditProfileScreen = ({ employerProps, isPreview }: ProfileScrenProps) => {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser._id);
  const employeeSettings = useSelector((state: RootState) => state.loggedInUser.settings);
  const isEmployeeNew = useSelector((state: RootState) => state.loggedInUser.preferences.isNew);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  const isEmployee = !employerProps;

  const [isEditMode, setIsEditMode] = useState(isEmployee ? isEmployeeNew : !isPreview);

  const styles = useStyles();

  const onPreviewPress = () => {
    setIsEditMode(false);
  };

  const returnEmployeeUi = () => {
    if (isEditMode) {
      return <EditEmployee editEmployeeData={{ employeeSettings, _id: loggedInUserId }} />;
    } else {
      return <ResumeComponent isOwner={true} currentEmployeeSettings={{ ...employeeSettings }} />;
    }
  };

  const onSavePress = () => {
    console.log('asdf');
  };

  if (!isLoggedIn) {
    return;
  }

  return (
    <>
      <BannerWhite>
        {isEditMode ? (
          <KeeperSelectButton
            onClick={onPreviewPress}
            title="Preview Resume"
            buttonStyles={styles.createNewJobButton}
          />
        ) : (
          <KeeperSelectButton onClick={onSavePress} title="Save Resume" buttonStyles={styles.createNewJobButton} />
        )}
      </BannerWhite>
      {returnEmployeeUi()}
    </>
  );
};

export default EditProfileScreen;
