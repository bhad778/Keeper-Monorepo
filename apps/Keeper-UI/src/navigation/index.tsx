import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState, useRef } from 'react';
import { Auth } from 'aws-amplify';
import * as Font from 'expo-font';
import { useSelector, useDispatch } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import { AppState, StatusBar } from 'react-native';
import PubNub from 'pubnub';
import { PubNubProvider } from 'pubnub-react';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { useDidMountEffect } from 'hooks';
import {
  ViewJobPosting,
  ViewResume,
  Resume,
  EmployeesThatLikedJob,
  VerificationCode,
  PhoneNumber,
  AccountType,
  AddJob,
  PublicJobBoard,
  EducationSwiper,
  SendMessages,
  Name,
} from 'screens';
import { JobsService, useAuth, UsersService } from 'services';
import {
  addLoggedInUser,
  addMatches,
  addReceivedLike,
  RootState,
  updateMatch,
  updateMatchNotificationRedux,
} from 'reduxStore';
import { useTheme } from 'theme/theme.context';

import BottomTabNavigator from './BottomTabNavigator';
import getEnvVars from '../../environment';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function Navigation() {
  const loggedInUserId = useSelector((state: RootState) => state.loggedInUser?._id);
  const isLoggedIn = useSelector((state: RootState) => state.loggedInUser.isLoggedIn);

  // this will update after the getUserData() function is called, triggering the useEffect to hide splash screen
  const accountType = useSelector((state: RootState) => state.loggedInUser.accountType);

  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);
  const url = Linking.useURL();
  const { theme } = useTheme();
  const { pubNubPublishKey, pubNubSubscribeKey } = getEnvVars();
  const dispatch = useDispatch();
  const { getUserData } = useAuth();
  // const { getUserData, logOut } = useAuth();
  const navigationRef = useRef(null);

  const isEmployee = accountType === 'employee';

  const [initialScreen, setInitialScreen] = useState<string>('');
  const pubnub = new PubNub({
    publishKey: pubNubPublishKey,
    subscribeKey: pubNubSubscribeKey,
    userId: loggedInUserId || 'blank',
  });

  useEffect(() => {
    // logOut();
    loadInitialData();

    // this does not work when the debugger is on!!
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      if (notification.request.content.data.type === 'message') {
        const matchId = notification?.request?.content?.data?.matchData?.id;
        const message = notification?.request?.content?.data?.message;
        const matchNotificationObject = {
          matchId,
          hasNotification: true,
        };

        // update notification locally, it gets updated in DB when message is sent
        dispatch(updateMatchNotificationRedux({ ...matchNotificationObject }));
        // update match with latest text
        dispatch(
          updateMatch({
            matchData: { id: matchId, updated: new Date(), description: message.text || '' },
          }),
        );
        // this handles updating selectedJob match
        // if (accountType != 'employee') {
        //   dispatch(
        //     updateSelectedJobMatch({
        //       matchData: { id: matchId, updated: new Date(), description: message.text || '' },
        //     }),
        //   );
        //   dispatch(updateSelectedJobMatchNotificationRedux(matchNotificationObject));
        // }
      } else if (notification.request.content.data.type === 'match') {
        const jobId = notification?.request?.content?.data?.matchData?.custom?.jobId;
        const matchData = notification?.request?.content?.data?.matchData;

        dispatch(addMatches({ newMatches: [matchData], jobId }));
      } else if (notification.request.content.data.type === 'like') {
        const receivedLikeId = notification?.request?.content?.data?.message.senderId;
        const jobId = isEmployee ? '' : notification?.request?.content?.data?.message.jobId;

        dispatch(addReceivedLike({ receivedLikeId, jobId }));
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // fire when app comes to the foreground
    const subscription = AppState.addEventListener('change', async (nextAppState: any) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active' && isLoggedIn && accountType) {
        // this if else handles updated matches to see if theres a new message, and handles updating
        // received likes so we can know if this job has been liked by anyone so we can tell if its a match
        if (accountType === 'employee') {
          UsersService.getEmployee({ userId: loggedInUserId || '' }).then(employeeMatchesResponse => {
            dispatch(
              addLoggedInUser({
                matches: employeeMatchesResponse?.matches,
                receivedLikes: employeeMatchesResponse?.receivedLikes,
              }),
            );
          });
        } else if (accountType === 'employer') {
          JobsService.getEmployersJobs({ userId: loggedInUserId || '' }).then(jobsMatchesResponse => {
            dispatch(addLoggedInUser({ employersJobs: jobsMatchesResponse }));
          });
        }
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [accountType, isLoggedIn, loggedInUserId, dispatch]);

  useDidMountEffect(() => {
    // when get getUserData(), it gets the data and sets it in redux, which will trigger this useEffect
    // setInitialScreen('Root');
    navigationRef.current?.navigate('Root');
  }, [accountType]);

  // useDidMountEffect(() => {
  //   if (url) {
  //     const { hostname, path, queryParams } = Linking.parse(url);

  //     if (path) {
  //       // handle changing initial screen based on deep link
  //       // setInitialScreen('Root');
  //     }
  //   }
  // }, [url]);

  useDidMountEffect(() => {
    // initialScreen not being empty is what triggers the splash screen to hide. If the
    // user is currently logged in which we check with the Auth.currentAuthenticatedUser() function,
    // then we get user data and setInitialScreen based on if theyre an employee or employer,
    // if theyre not logged in we set intialScreen to login. Each of these scenarios called setInitialScreen
    // which triggers hiding the splash screen
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };

    hideSplashScreen();
  }, [initialScreen]);

  const loadInitialData = async () => {
    const checkDevicePromise = Auth.currentAuthenticatedUser({
      bypassCache: false, // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    });
    const fontPromise = await Font.loadAsync({
      'app-header-font': require('assets/fonts/Borna-Medium.otf'),
      'app-bold-font': require('assets/fonts/CircularStd-Book.otf'),
      'app-default-font': require('assets/fonts/CircularStd-Light.otf'),
      'app-page-title-font': require('assets/fonts/CircularStd-Medium.otf'),
    });
    try {
      const response = await Promise.all([checkDevicePromise, fontPromise]);
      // if the above checkDevicePromise() call does not throw an error, then the user is logged in
      await getUserData(response[0]?.attributes['custom:accountType'], response[0].attributes.phone_number);
      dispatch(addLoggedInUser({ isLoggedIn: true }));
    } catch (error) {
      if (error === 'The user is not authenticated') {
        // if it errored because of the checkDevicePromise() call,
        // then user is not already logged in
        setInitialScreen('AccountType');
      }
      // console.error('Loading initial app data error', error);
    }
  };

  // return null and continue showing splash screen if initial screen isnt set
  if (!initialScreen) {
    return null;
  }

  return (
    <PubNubProvider client={pubnub}>
      <NavigationContainer theme={DefaultTheme} ref={navigationRef}>
        <RootNavigator initialScreen={initialScreen} />
        <StatusBar backgroundColor={theme.color.primary} />
      </NavigationContainer>
    </PubNubProvider>
  );
}

const Stack = createStackNavigator();

type RootNavigatorProps = {
  initialScreen: string;
};

function RootNavigator({ initialScreen }: RootNavigatorProps) {
  return (
    <Stack.Navigator initialRouteName={initialScreen}>
      <Stack.Screen name='EducationSwiper' component={EducationSwiper} options={{ headerShown: false }} />
      <Stack.Screen name='SendMessages' component={SendMessages} options={{ headerShown: false }} />
      <Stack.Screen name='Name' component={Name} options={{ headerShown: false }} />
      <Stack.Screen name='Root' component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name='PublicJobBoard' component={PublicJobBoard} options={{ headerShown: false }} />
      <Stack.Screen name='Resume' component={Resume} options={{ headerShown: false }} />
      <Stack.Screen name='ViewResume' component={ViewResume} options={{ headerShown: false }} />
      <Stack.Screen name='ViewJobPosting' component={ViewJobPosting} options={{ headerShown: false }} />
      <Stack.Screen name='AccountType' component={AccountType} options={{ headerShown: false }} />
      <Stack.Screen name='PhoneNumber' component={PhoneNumber} options={{ headerShown: false }} />
      <Stack.Screen name='VerificationCode' component={VerificationCode} options={{ headerShown: false }} />
      <Stack.Screen name='AddJob' component={AddJob} options={{ headerShown: false }} />
      <Stack.Screen name='EmployeesThatLikedJob' component={EmployeesThatLikedJob} />
    </Stack.Navigator>
  );
}
