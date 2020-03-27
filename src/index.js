import React from 'react';
import {NavigationContainer} from '@react-navigation/native';

import './config/ReactotronConfig';

import Route from './routes';

export default function App() {
  return (
    <NavigationContainer>
      <Route />
    </NavigationContainer>
  );
}
