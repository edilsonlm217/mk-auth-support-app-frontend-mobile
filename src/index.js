import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { NotificationStateProvider } from './store/notification';
import AsyncStorage from '@react-native-community/async-storage';
import OneSignal from 'react-native-onesignal';

import { ClientStateProvider } from './store/client';
import { StateProvider } from './store/store';

import './config/ReactotronConfig';

import Route from './routes';

export default function App() {
  useEffect(() => {
    //Remove this method to stop OneSignal Debugging 
    OneSignal.setLogLevel(6, 0);

    // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init("ba39cc13-1ac4-46f6-82f5-929b5b3a6562", {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2
    });

    OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

    OneSignal.addEventListener('received', onReceived);
    OneSignal.addEventListener('opened', onOpened);
    OneSignal.addEventListener('ids', onIds);

    return (
      async () => {
        OneSignal.removeEventListener('received', onReceived);
        OneSignal.removeEventListener('opened', onOpened);
        OneSignal.removeEventListener('ids', onIds);
        await AsyncStorage.removeItem('@OneSignalUserId')
      }
    );
  }, []);

  function onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  function onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
    OneSignal.clearOneSignalNotifications();
  }

  async function onIds(device) {
    const { userId } = device;

    await AsyncStorage.setItem('@OneSignalUserId', userId);
    console.log('Device info: ', device);
  }

  return (
    <StateProvider>
      <NotificationStateProvider>
        <ClientStateProvider>
          <NavigationContainer linking={linking}>
            <Route />
          </NavigationContainer>
        </ClientStateProvider>
      </NotificationStateProvider>
    </StateProvider>
  );
}
