import React from 'react';
import { StyleProp, View, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AppBoldText, AppText } from 'components';
import { useTheme } from 'theme/theme.context';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useStyles } from './RedesignHeaderStyles';

type TRedesignHeader = {
  title: string;
  containerStyles?: StyleProp<ViewStyle>;
  titleStyles?: StyleProp<TextStyle>;
  children?: React.ReactNode;
  rightContents?: {
    icon?: 'check' | 'example';
    text?: string;
    action: () => void;
  };
};

const RedesignHeader = ({ title, containerStyles, children, rightContents, titleStyles }: TRedesignHeader) => {
  const { theme } = useTheme();

  const styles = useStyles();

  return (
    <SafeAreaView edges={['top']}>
      <View style={[styles.container, containerStyles]}>
        <View style={styles.jobBoardHeader}>
          <View style={styles.headerLeftSection}>{children}</View>

          <View style={styles.headerMiddleSection}>
            <AppText style={[styles.title, titleStyles]}>{title}</AppText>
          </View>
          <View style={styles.headerRightSection}>
            {rightContents && (
              <TouchableOpacity
                style={styles.rightTouchable}
                onPress={() => rightContents.action()}
                hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                {rightContents.icon && <Icon name={rightContents.icon} size={35} color={theme.color.pink} />}
                {rightContents.text && <AppBoldText style={styles.rightContentsText}>{rightContents.text}</AppBoldText>}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RedesignHeader;
