import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import useStyles from './MatchStyles';
import { AppBoldText, AppHeaderText, AppText, KeeperImage } from 'components';

type MatchProps = {
  text: string;
  img: string;
  title: string;
  color: string;
  isEmployee: boolean;
  isCandidateSort: boolean;
  isNew?: boolean;
  hasNotification?: boolean;
  onPress: () => void;
};

const Match = ({
  text,
  img,
  title,
  color,
  isNew,
  hasNotification,
  isEmployee,
  isCandidateSort,
  onPress,
}: MatchProps) => {
  const styles = useStyles(isEmployee, isCandidateSort, color, isNew);

  return (
    <TouchableOpacity style={styles.channelListItem} onPress={onPress}>
      {/* {hasNotification && <View style={styles.redCircle} />} */}
      {isNew && (
        <View style={styles.newMatchTextContainer}>
          <AppBoldText style={styles.newMatchText}>New Match!</AppBoldText>
        </View>
      )}
      <View style={styles.contents}>
        <KeeperImage
          style={styles.avatar}
          resizeMode={isEmployee ? 'contain' : 'cover'}
          source={{
            uri: img,
          }}
        />
        <View style={styles.channelTextContainer}>
          <AppHeaderText style={styles.channelTitle} numberOfLines={2}>
            {title}
          </AppHeaderText>
          <AppText style={styles.channelText} numberOfLines={2}>
            {text}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Match;
