import { useCallback, useState } from 'react';
import { TMatch } from 'types';
import { Match } from 'components';
import { getFirstNameAndInitialFromFullName } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reduxStore/store';
import { updateMatchNotificationRedux } from 'reduxStore';
import { UsersService } from 'services';

type ChannelListItemProps = {
  channel: TMatch;
  isEmployee: boolean;
  senderId: string;
  senderName: string;
  senderImg: string;
  isCandidateSort: boolean;
  jobColor?: string;
  setSelectedChannel: (channel: TMatch) => void;
  isAChannelSelected: boolean;
};

const ChannelListItem = ({
  channel,
  isEmployee,
  senderId,
  isCandidateSort,
  jobColor,
  setSelectedChannel,
}: ChannelListItemProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [color] = useState(isEmployee ? channel?.custom?.employeeColor : jobColor);
  const dispatch = useDispatch();

  const returnTitle = useCallback(() => {
    if (isEmployee) {
      return channel.name;
    } else {
      return getFirstNameAndInitialFromFullName(channel.name);
    }
  }, [channel.name, isEmployee]);

  const removeNotificationsFromMatchLocally = useCallback(
    (channelId: string) => {
      // remove notifications when pressing on channel
      // if channel has a notification
      const matchNotificationObject = {
        matchId: channelId,
        hasNotification: false,
      };

      dispatch(updateMatchNotificationRedux(matchNotificationObject));
    },
    [dispatch]
  );

  // this is fired when pressing on a channel
  const openSendMessage = (channel: TMatch) => {
    setSelectedChannel(channel);

    const matchUpdateObject = {
      id: channel.id,
      custom: {
        hasNotification: false,
        isNew: false,
      },
    };
    // if (isEmployee) {
    //   dispatch(updateMatch({ matchData: matchUpdateObject }));
    // }
    try {
      UsersService.updateOwnMatch({
        userId: senderId,
        accountType,
        matchToUpdate: matchUpdateObject,
      });
    } catch (error) {
      if (error) {
        console.error('updateOwnMatch error: ', error);
      }
    }
    if (channel.custom.hasNotification) {
      removeNotificationsFromMatchLocally(channel.id);
    }
  };

  const onMatchClick = () => {
    openSendMessage(channel);
  };

  return (
    // <div
    //   style={styles.channelListItem}
    //   onClick={() => openSendMessage(channel)}
    // >
    //   {channel.custom.isNew && (
    //     <div style={styles.newMatchTextContainer}>
    //       <AppBoldText style={styles.newMatchText}>New Match!</AppBoldText>
    //     </div>
    //   )}

    //   <KeeperImage style={styles.avatar} source={channel.custom.profileUrl} />

    //   <div style={styles.channelTextContainer}>
    //     {channel.custom.hasNotification && <Badge style={styles.redCircle} />}

    //     <AppHeaderText style={styles.channelTitle} numberOfLines={2}>
    //       {returnTitle()}
    //     </AppHeaderText>

    //     <AppHeaderText style={styles.channelText} numberOfLines={2}>
    //       {channel.description}
    //     </AppHeaderText>
    //   </div>
    // </div>
    <Match
      text={channel.description}
      img={channel.custom.profileUrl}
      title={returnTitle()}
      color={color || ''}
      isNew={channel.custom.isNew}
      hasNotification={channel.custom.hasNotification}
      isEmployee={isEmployee}
      isCandidateSort={isCandidateSort}
      onPress={onMatchClick}
    />
  );
};

export default ChannelListItem;
