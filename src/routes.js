import React, { useState, useContext, useMemo, useEffect } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import { store } from './store/store';

import Home from './pages/Home/index';
import Details from './pages/Details/index';
import InitialConfig from './pages/InitialConfig/index';
import AuthScreen from './pages/AuthScreen/index';
import SettingsScreen from './pages/SettingsScreen/index';

const Stack = createStackNavigator();

export default function RootStack() {
  const [isSigned, setIsSigned] = useState(false);
  
  const globalState = useContext(store);
  const { dispatch } = globalState;

  async function TokenChecking() {
    const token = await AsyncStorage.getItem('@auth_token');
    const employee_id = await AsyncStorage.getItem('@employee_id');
    const server_ip = await AsyncStorage.getItem('@server_ip');
    const server_port = await AsyncStorage.getItem('@server_port');

    if (isSigned === false) {
      if (token !== null && employee_id !== null) {
        dispatch({ type: 'setTokenFromAsync', payload: {
          employee_id,
          token,
          server_ip,
          server_port,
        }});
      }

      if (globalState.state.token !== null) {
        setIsSigned(true);
      }
    }


    if (isSigned === true) {
      if (globalState.state.token === null) {
        setIsSigned(false);
      }
    }
  }
  
  TokenChecking();

  return (
    <Stack.Navigator
      screenOptions={{gestureEnabled: true, headerShown: true}}
    >
      {
        isSigned 
        ? 
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
        :
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
      }
    </Stack.Navigator>
  );
}
