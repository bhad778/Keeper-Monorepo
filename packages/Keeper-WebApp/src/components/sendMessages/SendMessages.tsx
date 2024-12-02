import PubNub, { UriFileInput } from 'pubnub';
import { memo } from 'react';
import { PubNubProvider } from 'pubnub-react';
import { Chat, MessageInput, MessageList, MessagePayload } from '@pubnub/react-chat-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reduxStore/store';
import { AppHeaderText, Clickable, KeeperImage } from 'components';
import { setMatches, updateMatch } from 'reduxStore';
import { MiscService, UsersService } from 'services';
import { getFirstNameAndInitialFromFullName } from 'utils';
import { TMatch } from 'types';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

import Message from './Message';
import { useStyles } from './SendMessagesStyles';

type SendMessagesProps = {
  channel: TMatch;
  senderId: string;
  color: string;
  name: string;
  img: string;
  closeSendMessages: () => void;
};

const SendMessages = ({ channel, senderId, color, name, img, closeSendMessages }: SendMessagesProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmployee = accountType === 'employee';
  const styles = useStyles(color, isEmployee);

  const pubNubPublishKey = import.meta.env.VITE_PUBNUB_PUBLISH_KEY;
  const pubNubSubscribeKey = import.meta.env.VITE_PUBNUB_SUBSCRIBE_KEY;

  const pubnub = new PubNub({
    publishKey: pubNubPublishKey,
    subscribeKey: pubNubSubscribeKey,
    userId: senderId || 'blank',
  });

  const onBeforeSend = (message: MessagePayload) => {
    const data = {
      ...message,
      profilePic: '',
      fullName: '',
      expoPushToken: channel.custom.expoPushToken,
      senderId: senderId,
    };
    data.profilePic = img;
    data.fullName = name;
    return data;
  };

  const onSend = (message: MessagePayload | File | UriFileInput) => {
    const messageObject = {
      to: message.expoPushToken,
      title: message.fullName,
      body: message.text,
      sound: 'default',
      data: {
        type: 'message',
        senderId,
        receiverId: isEmployee ? channel.custom.jobOwnerId : channel.custom.employeeId,
        matchData: channel,
        message,
      },
    } as const;
    try {
      MiscService.sendPubnubNotification({
        messageObject,
      });
    } catch (error) {
      console.error('there was an error sending expo push notification from message send- ', error);
    }

    try {
      UsersService.updateMatchForBothOwners({
        userId: senderId,
        accountType,
        matchToUpdate: {
          id: channel.id,
          updated: new Date(),
          description: message.text,
        },
      }).then((response) => {
        if (response.error && response.error == 'Account deleted error') {
          UsersService.deleteMatch({
            userId: senderId,
            accountType,
            matchToDeleteId: channel.id,
          }).then((response) => {
            dispatch(setMatches({ newMatches: response.matches, jobId: senderId }));
          });
          toast.error(
            `This ${isEmployee ? 'job' : 'candidate'} no longer exists and will be removed from your matches.`,
          );
          closeSendMessages();
        }
      });
    } catch (error) {
      if (error) {
        console.error('Update match error: ', error);
      }
    }

    dispatch(
      updateMatch({
        matchData: {
          id: channel.id,
          updated: new Date(),
          description: message.text || '',
        },
      }),
    );
  };

  const returnTitle = () => {
    if (isEmployee) {
      return channel.name.split(' at ')[0];
    } else {
      return getFirstNameAndInitialFromFullName(channel.name);
    }
  };

  const returnSubTitle = () => {
    if (isEmployee) {
      return channel.custom.companyName;
    } else {
      return channel.custom.jobTitle;
    }
  };

  const onProfilePicPress = () => {
    if (isEmployee) {
      navigate('/viewJobPosting/' + channel.custom.jobId);
    } else {
      navigate('/viewResume/' + channel.custom.employeeId);
    }
  };

  return (
    <div style={styles.container}>
      <Clickable style={styles.xButtonContainer} onClick={closeSendMessages}>
        <CloseIcon sx={styles.xIcon} />
      </Clickable>
      <div style={styles.sendMessageHeader}>
        <Clickable style={styles.logoContainer} onClick={onProfilePicPress}>
          <KeeperImage style={styles.avatar} source={channel.custom.profileUrl} />
        </Clickable>
        <div style={styles.messagesNameAndTitleContainer}>
          <div style={styles.messageeNameContainer}>
            <AppHeaderText style={styles.title}>{returnTitle()}</AppHeaderText>
          </div>
          <div style={styles.messageeNameContainer}>
            <AppHeaderText style={styles.subTitle}>{returnSubTitle()}</AppHeaderText>
          </div>
        </div>
      </div>
      <PubNubProvider client={pubnub}>
        <Chat {...{ currentChannel: channel.id }}>
          <MessageList
            fetchMessages={25}
            messageRenderer={({ message: envelope }: any) => (
              <Message
                text={envelope.message.text}
                isOwnMessage={senderId === envelope.message.senderId}
                selectedJobColor={color || 'white'}
              />
            )}
          />
          <MessageInput
            style={styles.messageInput}
            onBeforeSend={onBeforeSend}
            onSend={onSend}
            sendButton={<span></span>}
          />
        </Chat>
      </PubNubProvider>
    </div>
  );
};

export default memo(SendMessages);
