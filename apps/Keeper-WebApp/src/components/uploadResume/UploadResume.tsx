import { AppText, AppHeaderText, AppBoldText, LoadingSpinner, KeeperButton } from 'components';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';
import { useSelector, useDispatch } from 'react-redux';
import { addLoggedInUser, RootState } from 'reduxStore';
import { ResumesService, UsersService } from 'keeperServices';
import toast from 'react-hot-toast';

import useStyles from './UploadResumeStyles';

interface UploadResumeProps {
  onComplete?: () => void;
}

const UploadResume = ({ onComplete }: UploadResumeProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const userId = useSelector((state: RootState) => state.loggedInUser._id);
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);
  const dispatch = useDispatch();
  const styles = useStyles();

  const allowedTypes = ['PDF'];

  const handleFileChange = (file: File) => {
    setFile(file);
    // Reset success state when a new file is selected
    setUploadSuccess(false);
  };

  const onUploadClick = async () => {
    if (!file || !userId) return;

    try {
      setIsUploading(true);

      // Convert file to base64
      const base64File = await fileToBase64(file);

      // Call the API
      const response = await ResumesService.uploadResume({
        employeeId: userId,
        fileName: file.name,
        fileData: base64File,
        mimeType: file.type,
      });

      if (response.success) {
        setUploadSuccess(true);
        toast.success('Resume uploaded successfully!');
        setFile(null); // Clear the file after successful upload

        // Update the hasResume flag in the database
        await UsersService.updateUserData({
          userId,
          accountType,
          updateObject: { hasResume: true },
        });

        // Update the hasResume flag in Redux
        dispatch(addLoggedInUser({ hasResume: true }));

        // Call the onComplete callback if it exists
        if (onComplete) {
          onComplete();
        }
      } else {
        toast.error(response.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('An error occurred while uploading your resume');
    } finally {
      setIsUploading(false);
    }
  };

  // Helper function to convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  return (
    <div style={styles.container}>
      <AppHeaderText style={styles.headerText}>
        Upload your resume so we can help you tailor it for each job application
      </AppHeaderText>

      <div style={styles.uploadContainer}>
        <FileUploader
          handleChange={handleFileChange}
          name='file'
          types={allowedTypes}
          hoverTitle='Drop your resume here'
          dropMessageStyle={styles.dropMessageStyle}
          maxSize={5}
        />

        {file && (
          <div style={styles.fileInfoContainer}>
            <AppBoldText style={styles.fileName}>Selected file: {file.name}</AppBoldText>
            <AppText style={styles.fileSize}>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</AppText>
          </div>
        )}

        {isUploading ? (
          <div style={styles.spinnerContainer}>
            <LoadingSpinner />
          </div>
        ) : (
          <KeeperButton
            buttonStyles={styles.uploadButton}
            onClick={onUploadClick}
            text={uploadSuccess ? 'Upload Another' : 'Upload'}
            isLoading={isUploading}
            disabled={!file || isUploading}
          />
        )}

        {uploadSuccess && (
          <AppText style={styles.successMessage}>
            Your resume has been successfully uploaded and is ready to use for job applications.
          </AppText>
        )}
      </div>
    </div>
  );
};

export default UploadResume;
