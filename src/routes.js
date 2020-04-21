import React, { useState, useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { store } from './store/store';

import Home from './pages/Home/index';
import Details from './pages/Details/index';
import InitialConfig from './pages/InitialConfig/index';
import AuthScreen from './pages/AuthScreen/index';

const Stack = createStackNavigator();

export default function RootStack() {
  const [isSigned, setIsSigned] = useState(false);
  const globalState = useContext(store);

  async function TokenChecking() {
    if (isSigned === false) {
      if (globalState.state.token !== null) {
        setIsSigned(true);
        //const token = await AsyncStorage.getItem('@auth_token');
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
