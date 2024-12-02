import { AppText } from 'components';
import { RootState } from 'reduxStore';

import { useStyles } from './MessageStyles';
import { useSelector } from 'react-redux';

interface MessageProps {
  text: string;
  isOwnMessage: boolean;
  selectedJobColor?: string;
}

const Message = ({ text, isOwnMessage, selectedJobColor }: MessageProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const isEmployee = accountType === 'employee';

  const styles = useStyles(isOwnMessage, selectedJobColor, isEmployee);

  return (
    <div style={styles.messageRow}>
      <span style={styles.messageContainer}>
        <AppText style={styles.messageText}>{text}</AppText>
      </span>
    </div>
  );
};

export default Message;
