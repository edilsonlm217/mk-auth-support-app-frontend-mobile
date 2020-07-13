import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { store } from './store/store';

import Home from './pages/Home/index';
import Details from './pages/Details/index';
import InitialConfig from './pages/InitialConfig/index';
import AuthScreen from './pages/AuthScreen/index';
import SettingsScreen from './pages/SettingsScreen/index';
import CTOMapping from './pages/CTOMapping/index';
import PickNewLocation from './pages/PickNewLocation/index';
import ClientsScreen from './pages/ClientsScreen/index';

import { fonts } from './styles/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppStack() {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: true }}
    >
      <Stack.Screen
        name="Chamados"
        component={Home}
        options={{ headerShown: false }}
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
            fontSize: fonts.huge,
            marginLeft: -20,
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
            fontSize: fonts.huge,
            marginLeft: -20,
          },
        }}
      />

      <Stack.Screen
        name="UpdateClienteLocation"
        component={PickNewLocation}
        options={{
          title: 'Atualizar endereço',
          headerStyle: {
            backgroundColor: '#FFF',
          },
          headerTintColor: '#337AB7',
          headerTransparent: true,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: fonts.huge,
            marginLeft: -20,
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
            fontSize: fonts.huge,
            marginLeft: -20,
          },
        }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: true }}
    >
      <Stack.Screen
        name="InitialConfig"
        component={InitialConfig}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function RootTab() {
  const globalState = useContext(store);

  return (
    <>
      {globalState.state.userToken !== null
        ?
        <Tab.Navigator>
          <Tab.Screen name="Chamados" component={AppStack} />
          <Tab.Screen name="Clientes" component={ClientsScreen} />
        </Tab.Navigator>
        :
        <AuthStack />
      }
    </>

  );
}
