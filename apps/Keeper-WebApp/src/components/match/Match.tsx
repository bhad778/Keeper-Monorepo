import { AppBoldText, AppHeaderText, AppText, Clickable, KeeperImage } from 'components';

import useStyles from './MatchStyles';

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
  const styles = useStyles(!!isCandidateSort, color, isEmployee, isNew);

  return (
    <Clickable style={styles.channelListItem} onClick={onPress}>
      {hasNotification && <div style={styles.redCircle} />}
      {isNew && (
        <div style={styles.newMatchTextContainer}>
          <AppBoldText style={styles.newMatchText}>New Match!</AppBoldText>
        </div>
      )}
      <div style={styles.contents}>
        <KeeperImage style={styles.avatar} source={img} resizeMode="cover" />
        <div style={styles.channelTextContainer}>
          <AppHeaderText style={styles.channelTitle} numberOfLines={1}>
            {title}
          </AppHeaderText>
          <AppText style={styles.channelText} numberOfLines={3}>
            {text}
          </AppText>
        </div>
      </div>
    </Clickable>
  );
};
export default Match;
