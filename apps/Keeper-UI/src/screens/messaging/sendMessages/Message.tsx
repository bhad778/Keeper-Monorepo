import React from 'react';
import { View } from 'react-native';
import { AppText } from 'components';

import { useStyles } from './MessageStyles';

interface MessageProps {
  text: string;
  isOwnMessage: boolean;
  selectedJobColor?: string;
}

const Message = ({ text, isOwnMessage, selectedJobColor }: MessageProps) => {
  const styles = useStyles(isOwnMessage, selectedJobColor);

  return (
    <View style={styles.messageRow}>
      <View style={styles.messageContainer}>
        <AppText style={styles.messageText}>{text}</AppText>
      </View>
    </View>
  );
};

export default Message;
