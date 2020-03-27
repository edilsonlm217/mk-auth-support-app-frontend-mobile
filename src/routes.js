import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home/index';

const Stack = createStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{gestureEnabled: false, headerShown: false}}>
      <Stack.Screen name="Chamados" component={Home} />
    </Stack.Navigator>
  );
}
