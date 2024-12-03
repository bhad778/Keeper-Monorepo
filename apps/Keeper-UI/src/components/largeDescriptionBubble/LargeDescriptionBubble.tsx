import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppBoldText, AppText } from 'components';

import { useStyles } from './LargeDescriptionBubbleStyles';

type TLargeDescriptionBubble = {
  bubbleText: string | undefined;
  placeholderText?: string;
  openEditModal: (isVisible: boolean) => void;
};

const LargeDescriptionBubble = ({ bubbleText, placeholderText, openEditModal }: TLargeDescriptionBubble) => {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          openEditModal(true);
        }}
        style={styles.touchable}>
        {bubbleText ? (
          <AppBoldText style={styles.text} numberOfLines={4}>
            {bubbleText}
          </AppBoldText>
        ) : (
          <AppText style={styles.placeholderText}>{placeholderText}</AppText>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LargeDescriptionBubble;
