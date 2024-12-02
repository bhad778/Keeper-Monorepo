import { useState } from 'react';
import { KeeperSelectButton, AppHeaderText, AppText, KeeperModal, ModalSaveButton } from 'components';
import { EmploymentTypeEnum, TJobCompensation, EmploymentTypes } from 'types';
import { numberWithCommas } from 'utils';
import Slider from '@mui/material/Slider';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './CompensationModalStyles';

type CompensationProps = {
  setCompensationModalVisible: any;
  compensation: TJobCompensation;
  setCompensation: (compensation: TJobCompensation) => void;
  jobColor?: string;
};

const Compensation = ({ compensation, setCompensation, jobColor, setCompensationModalVisible }: CompensationProps) => {
  const [localCompensation, setLocalCompensation] = useState(compensation);
  const [hasSelectionChanged, setHasSelectionChanged] = useState(false);

  const styles = useStyles();
  const { theme } = useTheme();

  const onMultiSliderChange = (event: Event, newValues: number | number[]) => {
    if (Array.isArray(newValues))
      setLocalCompensation({
        ...localCompensation,
        payRange: { min: newValues[0], max: newValues[1] },
      });
  };

  const onChangeCommitted = () => {
    setHasSelectionChanged(true);
  };

  const onSelectEmploymentType = (type: EmploymentTypes) => {
    const updateObject: TJobCompensation = {
      type,
      payRange: { min: 0, max: 0 },
    };
    if (type === 'Salary') {
      updateObject.payRange = { min: 60000, max: 100000 };
    } else if (type === 'Contract') {
      updateObject.payRange = { min: 20, max: 60 };
    } else if (type === 'Contract to Hire') {
      updateObject.payRange = { min: 20, max: 60 };
      updateObject.salaryConversionRange = { min: 60000, max: 100000 };
    }
    setLocalCompensation(updateObject);
  };

  const closeModal = () => {
    setCompensationModalVisible(false);
    setHasSelectionChanged(false);
    setLocalCompensation(compensation);
  };

  const saveModal = () => {
    setCompensation(localCompensation);
    closeModal();
  };

  return (
    <KeeperModal modalStyles={styles.modal} isOpen closeModal={closeModal}>
      <ModalSaveButton onSaveClick={saveModal} disabled={!hasSelectionChanged} />
      <AppHeaderText
        style={{
          color: 'white',
          fontSize: 24,
        }}
      >
        COMPENSATION
      </AppHeaderText>

      <div style={styles.sliderSection}>
        <div style={styles.buttonsContainer}>
          {Object.keys(EmploymentTypeEnum)
            .filter((key) => isNaN(Number(key)))
            .map((type, index) => {
              return (
                <KeeperSelectButton
                  key={index}
                  onClick={() => onSelectEmploymentType(type)}
                  title={type}
                  selected={localCompensation.type === type}
                  buttonStyles={styles.paymentTypeButtons}
                  buttonColor={jobColor}
                  isBig
                />
              );
            })}
        </div>

        <div>
          <div>
            <AppHeaderText style={styles.text}>Pay Range </AppHeaderText>
            <AppText style={styles.text}>
              {localCompensation?.type === 'Salary'
                ? `between $${numberWithCommas(localCompensation?.payRange?.min)}k and $${numberWithCommas(
                    localCompensation?.payRange?.max
                  )}k/year`
                : `between $${localCompensation?.payRange?.min}/hour and $${localCompensation?.payRange?.max}/hour`}
            </AppText>
          </div>

          <Slider
            value={[localCompensation?.payRange?.min || 0, localCompensation?.payRange?.max || 0]}
            onChange={onMultiSliderChange}
            onChangeCommitted={onChangeCommitted}
            min={localCompensation?.type === 'Salary' ? 15000 : 8}
            max={localCompensation?.type === 'Salary' ? 300000 : 150}
            step={localCompensation?.type === 'Salary' ? 1000 : 1}
            sx={{
              '& .MuiSlider-thumb': {
                color: 'white',
              },
              '& .MuiSlider-track': {
                color: theme.color.pink,
              },
              '& .MuiSlider-rail': {
                color: theme.color.keeperGrey,
              },
            }}
            valueLabelDisplay="off"
          />
        </div>
      </div>
    </KeeperModal>
  );
};

export default Compensation;
