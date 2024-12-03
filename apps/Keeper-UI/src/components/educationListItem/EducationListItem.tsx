import { AppHeaderText, AppText } from 'components';
import React from 'react';
import { View } from 'react-native';
import { TEmployeeEducation } from 'keeperTypes';
import { toTitleCase } from 'projectUtils';

import { useStyles } from './EducationListItemStyles';

type EducationListItemType = {
  index: number;
  educationItem: TEmployeeEducation;
  textColor?: string;
};

const EducationListItem = ({ index, educationItem, textColor }: EducationListItemType) => {
  const styles = useStyles(textColor);

  return (
    <View key={index} style={styles.container}>
      <AppHeaderText style={styles.educationMajorText}>{toTitleCase(educationItem?.major)}</AppHeaderText>
      <AppText style={styles.educationDegreeAndSchoolText}>
        {educationItem?.degree}
        &nbsp;&nbsp;
        <View>
          <AppText style={styles.circle}>&#9679;</AppText>
        </View>
        &nbsp;&nbsp;
        {educationItem?.school + ' ' + educationItem?.endDate}
      </AppText>
    </View>
  );
};
export default EducationListItem;
