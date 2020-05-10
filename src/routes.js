import React, { useState, useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import { store } from './store/store';

import Home from './pages/Home/index';
import Details from './pages/Details/index';
import InitialConfig from './pages/InitialConfig/index';
import AuthScreen from './pages/AuthScreen/index';
import SettingsScreen from './pages/SettingsScreen/index';
import CTOMapping from './pages/CTOMapping/index';

const Stack = createStackNavigator();

export default function RootStack() {
  const globalState = useContext(store);

  return (
    <Stack.Navigator
      screenOptions={{gestureEnabled: true, headerShown: true}}
    >
      {globalState.state.userToken !== null ? (
        <>
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
                backgroundColor: '#FFF',
              },
              headerTintColor: '#337AB7',
              headerTransparent: true,
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
              },
            }}
          />

          <Stack.Screen 
            name="CTOs" 
            component={CTOMapping} 
            options={{
              title: 'Mapa de CTOs',
              headerStyle: {
                backgroundColor: '#FFF',
              },
              headerTintColor: '#337AB7',
              headerTransparent: true,
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
              },
            }}
          /> 

          <Stack.Screen
            name="Settings" 
            component={SettingsScreen} 
            options={{
              title: 'Configurações',
              headerStyle: {
                backgroundColor: '#FFF',
              },
              headerTintColor: '#337AB7',
              headerTransparent: true,
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 24,
              },
            }}
          />
        </> 
      ) : (
        <>
          <Stack.Screen 
            name="InitialConfig" 
            component={InitialConfig} 
            options={{headerShown: false}}
          />

          <Stack.Screen 
            name="AuthScreen" 
            component={AuthScreen} 
            options={{headerShown: false}}
          />
        </>
      )
    }
    </Stack.Navigator>
  );
}
