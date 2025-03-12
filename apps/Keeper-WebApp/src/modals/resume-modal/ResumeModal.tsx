import { KeeperModal, UploadResume, ViewResume } from 'components';
import { RootState } from 'reduxStore';
import { useSelector } from 'react-redux';

import { useStyles } from './ResumeModalStyles';

type ResumeModalProps = {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
};

const ResumeModal = ({ isVisible, setIsVisible }: ResumeModalProps) => {
  const hasResume = useSelector((state: RootState) => state.loggedInUser.hasResume);

  const styles = useStyles();

  const closeModal = () => {
    setIsVisible(false);
  };

  return (
    <KeeperModal isOpen={isVisible} modalStyles={styles.modal} closeModal={closeModal}>
      {hasResume ? <ViewResume /> : <UploadResume />}
    </KeeperModal>
  );
};

export default ResumeModal;
