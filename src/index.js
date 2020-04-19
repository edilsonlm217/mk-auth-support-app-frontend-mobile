import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { StateProvider } from './store/store';

import './config/ReactotronConfig';

import Route from './routes';

export default function App() {
  return (
    <StateProvider>
      <NavigationContainer>
        <Route />
      </NavigationContainer>
    </StateProvider>
  );
}
