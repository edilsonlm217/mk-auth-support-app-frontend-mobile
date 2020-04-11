import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Home from './pages/Home/index';
import Details from './pages/Details/index';

const Stack = createStackNavigator();

export default function RootStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{gestureEnabled: true, headerShown: true}}
    >
      <Stack.Screen 
        name="Chamados" 
        component={Home} 
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="Details" 
        component={Details} 
        options={{
          title: 'Mais detalhes',
          headerStyle: {
            backgroundColor: '#337AB7',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 24,
          },
        }}
      />
    </Stack.Navigator>
  );
}
