import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import { UsersService } from 'services';
import { addLoggedInUser } from 'reduxStore';
import Constants from 'expo-constants';

const useNotifications = () => {
  const dispatch = useDispatch();

  // all this does is ask for permission to send push notifications and then add expoPushToken to DB
  const registerForPushNotificationsAsync = async (
    loggedInUserId: string | undefined,
    accountType: string,
    loggedInUserExpoPushToken: string | null,
  ) => {
    let token;
    if (Device.isDevice) {
      if (!loggedInUserExpoPushToken && loggedInUserId) {
        token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants?.expoConfig?.extra?.eas.projectId,
        });
        dispatch(addLoggedInUser({ expoPushToken: token.data }));
        UsersService.updateExpoPushToken({
          id: loggedInUserId,
          accountType,
          expoPushToken: token.data,
        });
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  };

  type TSendPushNotification = {
    expoPushToken: string;
    title: string;
    body: string;
    sound?: string;
    data?: any;
  };

  const sendPushNotification = (pushNotification: TSendPushNotification) => {
    const message = {
      to: pushNotification.expoPushToken,
      title: pushNotification.title,
      body: pushNotification.body,
      data: pushNotification.data,
      sound: pushNotification.sound || 'default',
    };

    fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  return {
    registerForPushNotificationsAsync,
    sendPushNotification,
  };
};

export default useNotifications;
