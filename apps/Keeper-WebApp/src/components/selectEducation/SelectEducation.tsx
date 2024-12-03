import { EducationEnum } from 'keeperTypes';
import { KeeperSelectButton } from 'components';

import { useStyles } from './SelectEducationStyles';

type SelectEducationModalProps = {
  education: string;
  setEducation: (education: any) => void;
  educationModalVisible: boolean;
  setEducationModalVisible: (educationModalVisible: boolean) => void;
  jobColor?: string;
};

// 0 = Coding Bootcamp 1 = GED, 2 = Associate's, 3 = Bachelor's, 4 = Master's, 5 = Doctoral
// We do this because it has to be stored that way in DB to search
const SelectEducationModalProps = ({
  education,
  setEducation,
  educationModalVisible,
  setEducationModalVisible,
  jobColor,
}: SelectEducationModalProps) => {
  const styles = useStyles();

  return (
    <div>
      <div style={styles.educationTypeContainer}>
        <div style={styles.buttonsContainer}>
          {Object.keys(EducationEnum)
            .filter(key => isNaN(Number(key)))
            .map((educationItem: string, index: number) => (
              <KeeperSelectButton
                onClick={() => setEducation(educationItem)}
                key={index}
                title={educationItem}
                selected={education === educationItem}
                buttonStyles={{ backgroundColor: jobColor }}
                isBig
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default SelectEducationModalProps;
