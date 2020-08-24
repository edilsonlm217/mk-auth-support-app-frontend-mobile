import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StateProvider } from './store/store';
import { ClientStateProvider } from './store/client';
import { NotificationStateProvider } from './store/notification';

import './config/ReactotronConfig';

import Route from './routes';

export default function App() {
  return (
    <StateProvider>
      <NotificationStateProvider>
        <ClientStateProvider>
          <NavigationContainer>
            <Route />
          </NavigationContainer>
        </ClientStateProvider>
      </NotificationStateProvider>
    </StateProvider>
  );
}
