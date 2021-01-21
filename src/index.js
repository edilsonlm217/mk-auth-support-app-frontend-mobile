import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { ClientStateProvider } from './store/client';
import { StateProvider } from './store/store';

import './config/ReactotronConfig';

import Route from './routes';

export default function App() {
  return (
    <StateProvider>
      <ClientStateProvider>
        <NavigationContainer>
          <Route />
        </NavigationContainer>
      </ClientStateProvider>
    </StateProvider>
  );
}
