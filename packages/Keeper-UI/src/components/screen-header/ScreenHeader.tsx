import { AppHeaderText } from 'components';
import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';

import BlackBackIcon from '../../assets/svgs/arrow_left_black.svg';
import { useStyles } from './ScreenHeaderStyles';

type ScreenHeaderProps = {
  backgroundColor: string;
  goBack: () => void;
  title?: string;
  children?: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
};

const ScreenHeader = ({ backgroundColor, goBack, title, children, containerStyles }: ScreenHeaderProps) => {
  const styles = useStyles(backgroundColor, title?.length || 0);

  return (
    <View style={[styles.appBarHeader, containerStyles]}>
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={goBack}>
          <BlackBackIcon style={styles.backIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.middleSection}>
        <AppHeaderText style={styles.title} numberOfLines={1}>
          {title}
        </AppHeaderText>
      </View>
      <View style={styles.rightSection}>{children}</View>
    </View>
  );
};

export default ScreenHeader;
