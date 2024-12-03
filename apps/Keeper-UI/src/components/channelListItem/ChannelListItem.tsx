import React, { useCallback, useState } from 'react';
import { TMatch } from 'keeperTypes';
import { Match } from 'components';
import { getFirstNameAndInitialFromFullName } from 'projectUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState, updateMatch, updateMatchNotificationRedux } from 'reduxStore';
import { UsersService } from 'services';

import { useStyles } from './ChannelListItemStyle';

type ChipProps = {
  channel: TMatch;
  isEmployee: boolean;
  senderId: string;
  senderName: string;
  senderImg: string;
  isCandidateSort: boolean;
  jobColor?: string;
};

const ChannelListItem = ({
  channel,
  isEmployee,
  senderId,
  senderName,
  senderImg,
  isCandidateSort,
  jobColor,
}: ChipProps) => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const [color] = useState(isEmployee ? channel?.custom?.employeeColor : jobColor);
  const styles = useStyles(isCandidateSort, isEmployee, color, channel.custom.isNew);
  const dispatch = useDispatch();
  const navigation = useNavigation();

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
    [dispatch],
  );

  // this is fired when pressing on a channel
  const openSendMessage = useCallback(
    (channel: TMatch) => {
      navigation.navigate('SendMessages', {
        channel,
        senderId,
        color: color || '',
        name: senderName,
        img: senderImg,
      });
      const matchUpdateObject = {
        id: channel.id,
        custom: {
          profileUrl: channel?.custom?.profileUrl,
          hasNotification: false,
          expoPushToken: channel?.custom?.expoPushToken,
          isNew: false,
          employeeColor: isEmployee ? channel?.custom?.employeeColor : '',
        },
      };
      if (isEmployee) {
        dispatch(updateMatch({ matchData: matchUpdateObject as Partial<TMatch> }));
      }
      try {
        UsersService.updateOwnMatch({
          userId: senderId,
          accountType,
          matchToUpdate: matchUpdateObject as Partial<TMatch>,
        });
      } catch (error) {
        if (error) {
          console.error('updateOwnMatch error: ', error);
        }
      }

      if (channel.custom.hasNotification) {
        removeNotificationsFromMatchLocally(channel.id);
      }
    },
    [
      navigation,
      senderId,
      senderName,
      senderImg,
      color,
      isEmployee,
      dispatch,
      accountType,
      removeNotificationsFromMatchLocally,
    ],
  );

  const onMatchPress = () => {
    openSendMessage(channel);
  };

  return (
    // <TouchableOpacity style={styles.channelListItem} onPress={() => openSendMessage(channel)}>
    //   {channel.custom.hasNotification && <View style={styles.redCircle} />}

    //   {channel.custom.isNew && (
    //     <View style={styles.newMatchTextContainer}>
    //       <AppBoldText style={styles.newMatchText}>New Match!</AppBoldText>
    //     </View>
    //   )}
    //   <View style={styles.contents}>
    //     <KeeperImage
    //       style={styles.avatar}
    //       source={{
    //         uri: channel.custom.profileUrl,
    //       }}
    //     />

    //     <View style={styles.channelTextContainer}>
    //       <AppHeaderText style={styles.channelTitle} numberOfLines={2}>
    //         {returnTitle()}
    //       </AppHeaderText>
    //       <AppText style={styles.channelText} numberOfLines={2}>
    //         {channel.description}
    //       </AppText>
    //     </View>
    //   </View>
    // </TouchableOpacity>
    <Match
      text={channel.description}
      img={channel.custom.profileUrl}
      title={returnTitle()}
      color={color || ''}
      isNew={channel.custom.isNew}
      hasNotification={channel.custom.hasNotification}
      isEmployee={isEmployee}
      isCandidateSort={isCandidateSort}
      onPress={onMatchPress}
    />
  );
};

export default ChannelListItem;
