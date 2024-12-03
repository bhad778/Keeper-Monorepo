import { KeeperSelectButton, KeeperModal, AppHeaderText, ModalSaveButton } from 'components';
import { benefitOptions } from 'constants/globalConstants';

import { useStyles } from './BenefitsModalStyles';
import { useState } from 'react';
import { useDidMountEffect } from 'hooks';
import { checkTwoArraysEqual } from 'utils/globalUtils';

type BenefitsModalProps = {
  setBenefitsModalVisible: (setBenefitsModalVisible: boolean) => void;
  benefits: string[];
  setBenefits: (benefits: string[]) => void;
};

const BenefitsModal = ({ setBenefits, benefits, setBenefitsModalVisible }: BenefitsModalProps) => {
  const [localBenefits, setLocalBenefits] = useState(benefits);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();

  useDidMountEffect(() => {
    if (benefits && localBenefits && checkTwoArraysEqual(benefits, localBenefits)) {
      setHasSelectionChanged(false);
    } else {
      setHasSelectionChanged(true);
    }
  }, [localBenefits]);

  const onButtonClick = (benefit: string) => {
    if (benefit === 'None') {
      if (localBenefits.includes('None')) {
        setLocalBenefits(localBenefits.filter((item) => item !== 'None'));
      } else {
        setLocalBenefits(['None']);
      }
    } else {
      const currentBenefits = localBenefits.filter((item) => item !== 'None');
      currentBenefits.includes(benefit)
        ? setLocalBenefits(currentBenefits.filter((item) => item !== benefit))
        : setLocalBenefits([...currentBenefits, benefit]);
    }
    // setHasSelectionChanged(true);
  };

  const closeModal = () => {
    setBenefitsModalVisible(false);
    setHasSelectionChanged(false);
  };

  const onSave = () => {
    setBenefits(localBenefits);
    setBenefitsModalVisible(false);
    closeModal();
  };

  return (
    <KeeperModal modalStyles={styles.modal} isOpen closeModal={closeModal}>
      <ModalSaveButton onSaveClick={onSave} disabled={!hasSelectionChanged} />
      <AppHeaderText
        style={{
          color: 'white',
          fontSize: 24,
        }}
      >
        BENEFITS
      </AppHeaderText>

      <div style={styles.benefitButtonsContainer}>
        {benefitOptions.map((benefit, index) => {
          return (
            <KeeperSelectButton
              key={index}
              onClick={() => onButtonClick(benefit)}
              title={benefit}
              selected={localBenefits.includes(benefit)}
              buttonStyles={styles.buttonStyles}
              isBig
            />
          );
        })}
      </div>
    </KeeperModal>
  );
};

export default BenefitsModal;
