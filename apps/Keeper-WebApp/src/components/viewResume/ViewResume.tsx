import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addLoggedInUser, RootState } from 'reduxStore';
import { ResumesService, UsersService } from 'keeperServices';
import { AppText, AppBoldText, AppHeaderText, LoadingSpinner, KeeperSelectButton, UploadResume } from 'components';
import toast from 'react-hot-toast';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { TResumeData } from 'keeperTypes';

import useStyles from './ViewResumeStyles';

const ViewResume = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState<TResumeData | null>(null);
  const [showReplace, setShowReplace] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const userId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const dispatch = useDispatch();

  const styles = useStyles();

  useEffect(() => {
    fetchResumeData();
  }, [userId]);

  const fetchResumeData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      const response = await ResumesService.getResume({ employeeId: userId });

      if (response.success && response.data) {
        setResumeData(response.data);
      } else {
        toast.error('Failed to retrieve resume');
      }
    } catch (error) {
      console.error('Error retrieving resume:', error);
      toast.error('An error occurred while retrieving your resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      // Update the hasResume flag in the database
      await UsersService.updateUserData({
        userId,
        accountType,
        updateObject: { hasResume: true },
      });

      // Update the hasResume flag in Redux
      dispatch(addLoggedInUser({ hasResume: false }));

      toast.success('Resume deleted successfully');
    } catch (error) {
      console.error('Error deleting resume:', error);
      toast.error('An error occurred while deleting your resume');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleViewResume = () => {
    if (resumeData?.downloadUrl) {
      window.open(resumeData.downloadUrl, '_blank');
    }
  };

  if (showReplace) {
    return <UploadResume />;
  }

  if (isLoading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <AppHeaderText style={styles.headerText}>Your Resume</AppHeaderText>

      {resumeData ? (
        <div style={styles.resumeContainer}>
          <div style={styles.resumeIconContainer}>
            <DescriptionIcon style={styles.resumeIcon} />
          </div>

          <div style={styles.resumeDetails}>
            <AppBoldText style={styles.fileName}>{resumeData.resumeInfo.fileName}</AppBoldText>

            <AppText style={styles.uploadDate}>
              Uploaded on: {new Date(resumeData.resumeInfo.uploadDate).toLocaleDateString()}
            </AppText>
          </div>

          <div style={styles.actionsContainer}>
            <KeeperSelectButton
              buttonStyles={styles.viewButton}
              onClick={handleViewResume}
              title='View Resume'
              selected={true}
            />

            <div style={styles.buttonsRow}>
              <KeeperSelectButton
                buttonStyles={styles.replaceButton}
                onClick={() => setShowReplace(true)}
                title='Replace'
                IconComponent={UploadFileIcon}
              />

              {showDeleteConfirm ? (
                <div style={styles.confirmContainer}>
                  <AppText style={styles.confirmText}>Are you sure?</AppText>
                  <div style={styles.confirmButtons}>
                    <KeeperSelectButton buttonStyles={styles.confirmButton} onClick={handleDeleteResume} title='Yes' />
                    <KeeperSelectButton
                      buttonStyles={styles.cancelButton}
                      onClick={() => setShowDeleteConfirm(false)}
                      title='No'
                    />
                  </div>
                </div>
              ) : (
                <KeeperSelectButton
                  buttonStyles={styles.deleteButton}
                  onClick={() => setShowDeleteConfirm(true)}
                  title='Delete'
                  IconComponent={DeleteIcon}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={styles.noResumeContainer}>
          <AppText style={styles.noResumeText}>We couldn't find your resume. Please upload a new one.</AppText>
          <KeeperSelectButton
            buttonStyles={styles.uploadNewButton}
            onClick={() => dispatch(addLoggedInUser({ hasResume: false }))}
            title='Upload New Resume'
          />
        </div>
      )}
    </div>
  );
};

export default ViewResume;
