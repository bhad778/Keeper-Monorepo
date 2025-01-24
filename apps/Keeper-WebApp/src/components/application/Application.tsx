import { AppBoldText, AppHeaderText, AppText, Clickable, KeeperImage } from 'components';

import useStyles from './ApplicationStyles';

type ApplicationProps = {
  applicationId: string;
  text: string;
  img: string;
  title: string;
  isEmployee: boolean;
  isCandidateSort: boolean;
  isNew?: boolean;
  onPress: () => void;
};

const Application = ({
  applicationId,
  text,
  img,
  title,
  isNew,
  isEmployee,
  isCandidateSort,
  onPress,
}: ApplicationProps) => {
  const styles = useStyles(!!isCandidateSort, isEmployee, isNew);

  return (
    <Clickable style={styles.channelListItem} onClick={onPress}>
      {isNew && (
        <div style={styles.newMatchTextContainer}>
          <AppBoldText style={styles.newMatchText}>New Match!</AppBoldText>
        </div>
      )}
      <div style={styles.contents}>
        <KeeperImage style={styles.avatar} source={img} resizeMode='cover' />
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
export default Application;
