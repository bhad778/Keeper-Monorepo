import { AppText, Clickable } from 'components';

import { useStyles } from './LargeDescriptionBubbleStyles';

type TLargeDescriptionBubble = {
  bubbleText: string | undefined;
  placeholderText?: string;
  openEditModal: (isVisible: boolean) => void;
};

const LargeDescriptionBubble = ({ bubbleText, placeholderText, openEditModal }: TLargeDescriptionBubble) => {
  const styles = useStyles();
  return (
    <div style={styles.container}>
      <Clickable
        onClick={() => {
          openEditModal(true);
        }}
        style={styles.touchable}
      >
        {bubbleText ? (
          <AppText style={styles.text}>{bubbleText}</AppText>
        ) : (
          <AppText style={styles.placeholderText}>{placeholderText}</AppText>
        )}
      </Clickable>
    </div>
  );
};

export default LargeDescriptionBubble;
