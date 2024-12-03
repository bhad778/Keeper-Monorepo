import React from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { AppBoldText, BackButton } from 'components';
import Icon from 'react-native-vector-icons/Feather';
import { useTheme } from 'theme/theme.context';
import CogIcon from '../../assets/svgs/settingsIconWhite.svg';

import { useStyles } from './RedesignModalHeaderStyles';

type TRedesignModalHeader = {
  title: string;
  containerStyles?: StyleProp<ViewStyle>;
  isSaveDisabled?: boolean;
  children?: React.ReactNode;
  goBackAction?: any;
  onSave?: () => void;
  cogIconAction?: any;
};

const RedesignModalHeader = ({
  title,
  containerStyles,
  isSaveDisabled,
  children,
  goBackAction,
  onSave,
  cogIconAction,
}: TRedesignModalHeader) => {
  const styles = useStyles(title.length);
  const { theme } = useTheme();

  return (
    <View style={[styles.container, containerStyles]}>
      <View style={styles.jobBoardHeader}>
        {goBackAction && (
          <BackButton
            touchableContainerStyles={styles.backButtonContainer}
            iconStyles={styles.backIconStyles}
            goBackAction={goBackAction}
          />
        )}
        {cogIconAction && (
          <TouchableOpacity style={styles.backButtonContainer} onPress={cogIconAction} hitSlop={30}>
            <CogIcon style={styles.cogIconStyles} />
          </TouchableOpacity>
        )}

        <AppBoldText style={styles.title}>{title}</AppBoldText>
        {children ? (
          <View style={styles.rightIconTouchable}>{children}</View>
        ) : (
          <TouchableOpacity onPress={onSave} style={styles.rightIconTouchable} disabled={isSaveDisabled} hitSlop={50}>
            <Icon name='check' size={35} color={isSaveDisabled ? theme.color.white : theme.color.pink} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default RedesignModalHeader;
