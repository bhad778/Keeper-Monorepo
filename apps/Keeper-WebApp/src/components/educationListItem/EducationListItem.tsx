import { AppBoldText, AppText } from 'components';
import { TEmployeeEducation } from 'keeperTypes';
import { toTitleCase } from 'utils/globalUtils';

import { useStyles } from './EducationListItemStyles';

type EducationListItemType = {
  index: number;
  educationItem: TEmployeeEducation;
  shouldTextBeWhite?: boolean;
  textColor?: string;
  isSmallScreen: boolean;
};

const EducationListItem = ({
  index,
  educationItem,
  isSmallScreen,

  textColor,
}: EducationListItemType) => {
  const styles = useStyles(textColor, isSmallScreen);
  return (
    <div style={styles.educationItemContainer} key={index}>
      <AppBoldText style={styles.educationMajorText}>{toTitleCase(educationItem?.major)}</AppBoldText>
      <AppText style={styles.educationDegreeAndSchoolText}>
        {educationItem?.degree}
        &nbsp;&nbsp;
        <div>
          <AppText style={styles.circle}>&#9679;</AppText>
        </div>
        {educationItem?.school + ' ' + educationItem?.endDate}
      </AppText>
    </div>
  );
};
export default EducationListItem;
