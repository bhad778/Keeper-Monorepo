import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { EducationListItem, KeeperSelectButton, EducationHistoryItem, Clickable } from 'components';
import { TEmployeeEducation } from 'types';
import { isEducationHistoryItemComplete } from 'utils';
import { useTheme } from 'theme/theme.context';

import { useStyles } from './EducationHistoryStyles';

type EducationHistoryModalProps = {
  educationHistory: TEmployeeEducation[];
  setEducationHistory: any;
  hasCheckBeenPressed: boolean;
  hasUploadedResume: boolean;
};

const EducationHistoryModal = ({
  educationHistory,
  setEducationHistory,
  hasCheckBeenPressed,
  hasUploadedResume,
}: EducationHistoryModalProps) => {
  const [currentEducationItem, setCurrentEducationItem] = useState<TEmployeeEducation | null>(null);

  const styles = useStyles();
  const { theme } = useTheme();

  const isEducationHistoryItemCompleteWithChecks = (educationItem: TEmployeeEducation) => {
    if (!hasCheckBeenPressed && !hasUploadedResume) {
      return true;
    }

    return isEducationHistoryItemComplete(educationItem);
  };

  const addEducationItem = () => {
    setCurrentEducationItem({
      uuid: uuidv4(),
      school: '',
      major: '',
      endDate: '',
      degree: '',
    });
  };

  return (
    <>
      <EducationHistoryItem
        educationHistoryItem={currentEducationItem}
        educationHistory={educationHistory}
        setEducationHistory={setEducationHistory}
        educationHistoryItemModalVisible={!!currentEducationItem}
        setCurrentEducationItem={setCurrentEducationItem}
        hasCheckBeenPressed={hasCheckBeenPressed}
        hasUploadedResume={hasUploadedResume}
      />

      <div style={styles.contents}>
        {educationHistory.map((educationItem: TEmployeeEducation, index: number) => {
          const isComplete = isEducationHistoryItemCompleteWithChecks(educationItem);

          return (
            <Clickable
              style={{
                ...styles.preferenceItem,
                ...{
                  borderBottomColor: isComplete ? 'white' : theme.color.alert,
                },
              }}
              onClick={() => setCurrentEducationItem(educationItem)}
              key={index}
            >
              <EducationListItem educationItem={educationItem} index={index} textColor="white" isSmallScreen={false} />
            </Clickable>
          );
        })}
        <div style={styles.addEducationButtonContainer}>
          <KeeperSelectButton
            onClick={addEducationItem}
            title="Add Education"
            buttonStyles={styles.addItemButton}
            textStyles={styles.addItemButtonText}
          />
        </div>
      </div>
    </>
  );
};

export default EducationHistoryModal;
