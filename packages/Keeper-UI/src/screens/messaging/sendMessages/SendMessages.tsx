import React, { memo, useCallback } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View, TouchableOpacity } from 'react-native';
import PubNub, { UriFileInput } from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import { Chat, MessageInput, MessageList, MessagePayload } from '@pubnub/react-native-chat-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'reduxStore/store';
import { KeeperImage, ScreenHeader } from 'components';
import { setMatches, updateMatch } from 'reduxStore';
import { MiscService, UsersService } from 'services';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFirstNameAndInitialFromFullName } from 'utils';
import { SafeAreaView } from 'react-native-safe-area-context';

import Message from './Message';
import { useStyles } from './SendMessagesStyles';
import getEnvVars from '../../../../environment';

let latestUpdateForMatch: null | { id: string; updated: string; description: string } = null;

const SendMessages = () => {
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const route = useRoute();

  // these attributes are all of the sender
  const { channel, senderId, color, name, img } = route?.params;

  const styles = useStyles(color);
  const { pubNubPublishKey, pubNubSubscribeKey } = getEnvVars();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const isEmployee = accountType === 'employee';

  const pubnub = new PubNub({
    publishKey: pubNubPublishKey,
    subscribeKey: pubNubSubscribeKey,
    userId: senderId || 'blank',
  });

  const goBack = useCallback(() => {
    // UsersService.updateMatchNotification({
    //   userId: id || '',
    //   accountType,
    //   matchId: channel.id,
    //   hasNotification: false,
    // });
    if (latestUpdateForMatch) {
      dispatch(
        updateMatch({
          matchData: latestUpdateForMatch,
        }),
      );
    }
    navigation.goBack();
  }, [dispatch, navigation]);

  const onBeforeSend = useCallback(
    (message: MessagePayload) => {
      const data = {
        ...message,
        profilePic: '',
        fullName: '',
        expoPushToken: channel.custom.expoPushToken,
        senderId,
      };
      data.profilePic = img;
      data.fullName = name;
      return data;
    },
    [channel.custom.expoPushToken, img, senderId, name],
  );

  const onSend = useCallback(
    (message: MessagePayload | File | UriFileInput) => {
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
      // this is the sendPushNotification call but it has to be declared here
      // or it will create bug with pubnub because it causes a rerender if you
      // pull that function in through useNotifications
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
          matchToUpdate: { id: channel.id, updated: new Date(), description: message.text },
        }).then(response => {
          if (response.error && response.error == 'Account deleted error') {
            UsersService.deleteMatch({
              userId: senderId,
              accountType,
              matchToDeleteId: channel.id,
            }).then(response => {
              dispatch(setMatches({ newMatches: response.matches, jobId: senderId }));
            });
            Alert.alert('This user no longer exists and will be removed from your matches.', 'Press ok to go back.', [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ]);
          }
        });
      } catch (error) {
        if (error) {
          console.error('Update match error: ', error);
        }
      }
      latestUpdateForMatch = {
        id: channel.id,
        updated: new Date(),
        description: message.text || '',
      };
    },
    [senderId, isEmployee, channel, accountType, dispatch, navigation],
  );

  const returnTitle = useCallback(() => {
    if (isEmployee) {
      return channel.name.split(' at ')[0];
    } else {
      return getFirstNameAndInitialFromFullName(channel.name);
    }
  }, [channel.name, isEmployee]);

  const onProfilePicPress = useCallback(() => {
    if (isEmployee) {
      navigation.navigate('ViewJobPosting', {
        otherJobId: channel.custom.jobId,
      });
    } else {
      navigation.navigate('ViewResume', {
        otherUserId: channel.custom.employeeId,
      });
    }
  }, [isEmployee, navigation, channel.custom.jobId, channel.custom.employeeId]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaView} edges={['top']}>
        <ScreenHeader goBack={goBack} title={returnTitle()} backgroundColor={color || 'white'}>
          <TouchableOpacity onPress={onProfilePicPress}>
            <KeeperImage
              style={styles.avatar}
              source={{
                uri: channel.custom.profileUrl,
              }}
            />
          </TouchableOpacity>
        </ScreenHeader>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <PubNubProvider client={pubnub}>
          <Chat {...{ currentChannel: channel.id, theme: 'light' }}>
            <MessageList
              fetchMessages={25}
              messageRenderer={({ message: envelope }: any) => (
                <Message
                  text={envelope.message.text}
                  isOwnMessage={senderId === envelope.message.senderId}
                  selectedJobColor={color || 'white'}
                />
              )}
              style={{
                messageList: styles.messageList,
                messageListScroller: styles.messageListScroller,
              }}
            />
            <MessageInput
              style={{
                messageInputWrapper: styles.messageInputWrapper,
                messageInput: styles.messageInput,
                messageInputPlaceholder: styles.messageInputPlaceholder,
                sendButtonActive: { backgroundColor: 'green' },
                extraActions: { paddingTop: 10, backgroundColor: 'blue' },
              }}
              onBeforeSend={onBeforeSend}
              onSend={onSend}
              // sendButton={
              //   <TouchableOpacity style={{}} hitSlop={{ top: 30, right: 30, left: 30, bottom: 30 }}>
              //     <MaterialCommunityIcons name='send' size={30} color='white' />
              //   </TouchableOpacity>
              // }
            />
          </Chat>
        </PubNubProvider>
      </KeyboardAvoidingView>
    </View>
  );
};

export default memo(SendMessages);
