import AppBoldText from 'components/AppBoldText';
import AppHeaderText from 'components/AppHeaderText';
import { useState } from 'react';
import { FileUploader } from 'react-drag-drop-files';

import useStyles from './UploadResumeStyles';
import { KeeperSelectButton, ModalSaveButton } from 'components';

const UploadResume = () => {
  const [file, setFile] = useState<File | null>(null);

  const styles = useStyles();

  const allowedTypes = ['PDF'];

  const handleFileChange = (file: File) => {
    setFile(file);
  };

  const onUploadClick = () => {};

  return (
    <div>
      <AppHeaderText style={styles.headerText}>
        Upload your resume so we can help you tailor it for each job application
      </AppHeaderText>
      <FileUploader handleChange={handleFileChange} name='file' types={allowedTypes} />
      {file && <AppBoldText>Selected file: {file.name}</AppBoldText>}
      <KeeperSelectButton buttonStyles={styles.uploadButton} onClick={onUploadClick} title='Upload' selected />
    </div>
  );
};

export default UploadResume;
