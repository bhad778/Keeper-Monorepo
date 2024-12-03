import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Clickable } from 'components';

import useStyles from './KeeperModalStyles';

type KeeperModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  children: React.ReactNode;
  modalStyles?: React.CSSProperties;
};

const KeeperModal = ({ isOpen, closeModal, children, modalStyles }: KeeperModalProps) => {
  const styles = useStyles();

  return (
    <Modal
      open={isOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...styles.modalContents, ...modalStyles }}>
        <Clickable onClick={closeModal}>
          <CloseIcon sx={styles.xIcon} />
        </Clickable>

        {children}
      </Box>
    </Modal>
  );
};

export default KeeperModal;
