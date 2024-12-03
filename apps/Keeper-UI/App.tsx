/* eslint-disable no-undef */
import React from 'react';
import { LogBox, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import Amplify from '@aws-amplify/core';
import { store } from 'reduxStore/store';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import * as Linking from 'expo-linking';
import * as Sentry from 'sentry-expo';
import { AppHeaderText, KeeperModal, KeeperSelectButton } from 'components';

import awsconfig from './aws-exports';
import Navigation from './src/navigation';
import { ThemeProvider } from './src/theme/theme.context';
import { DEFAULT_THEME } from './src/theme/default.theme';

Sentry.init({
  dsn: 'https://f272bd6d0c8a49ecb5bec0758cf241d2@o4505097263906816.ingest.sentry.io/4505097265283072',
  enableInExpoDevelopment: false,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

LogBox.ignoreAllLogs(); //Ignore all log notifications

Amplify.configure(awsconfig);

SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {/* <StatusBar barStyle='light-content' /> */}
        <ThemeProvider initial={DEFAULT_THEME}>
          <KeeperModal
            isModalOpen={Constants.expoConfig.version < '0.0.25'}
            closeModal={() => true}
            modalStyles={{ padding: 25 }}>
            <AppHeaderText style={{ fontSize: 25, lineHeight: 30, paddingBottom: 15, textAlign: 'center' }}>
              Your app is out of date and needs to be updated
            </AppHeaderText>
            <KeeperSelectButton
              onPress={() =>
                Linking.openURL(
                  Platform.OS === 'ios'
                    ? 'https://apps.apple.com/us/app/keeper-find-software-jobs/id6448758803'
                    : 'https://play.google.com/store/apps/details?id=com.bhad778.keeperApp',
                )
              }
              title={'Update App'}
            />
          </KeeperModal>
          <Navigation />
          <Toast ref={ref => Toast.setRef(ref)} />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
