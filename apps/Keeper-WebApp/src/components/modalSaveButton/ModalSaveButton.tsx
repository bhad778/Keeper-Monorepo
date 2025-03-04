import { KeeperSelectButton } from 'components';

import useStyles from './ModalSaveButtonStyles';

type ModalSaveButtonProps = {
  onSaveClick: () => void;
  disabled?: boolean;
  title?: string;
};

const ModalSaveButton = ({ onSaveClick, disabled, title }: ModalSaveButtonProps) => {
  const styles = useStyles(!!disabled);

  return (
    <KeeperSelectButton
      buttonStyles={styles.modalSaveButton}
      onClick={onSaveClick}
      textStyles={styles.modalSaveText}
      title={title ? title : 'Save'}
    />
  );
};

export default ModalSaveButton;
