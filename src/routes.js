import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsIcon from 'react-native-vector-icons/Ionicons';

import { store } from './store/store';
import { notification_store } from './store/notification';
import { icons } from './styles/index';

import { Home } from './pages/Home/index';
import Details from './pages/Details/index';
import AuthScreen from './pages/AuthScreen/index';
import SettingsScreen from './pages/SettingsScreen/index';
import CTOMapping from './pages/CTOMapping/index';
import PickNewLocation from './pages/PickNewLocation/index';
import SearchScreen from './pages/SearchScreen/index';
import ClientScreen from './pages/ClientScreen/index';
// import NotificationTab from './pages/NotificationTab/index';
import CTODetails from './pages/CTODetails/index';

import { fonts } from './styles/index';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const NotificationStore = useContext(notification_store);
  
  return (
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        labelStyle: {
          fontSize: fonts.small,
        }
      }}>
      <Tab.Screen
        name="Chamados"
        component={Home}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="home" size={icons.tiny} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Buscar cliente',
          tabBarIcon: ({ color }) => (
            <Icon name="account-search" size={icons.tiny} color={color} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Notification"
        component={NotificationTab}
        options={{
          tabBarBadge: NotificationStore.state.notification_count,
          tabBarLabel: 'Notificações',
          tabBarIcon: ({ color }) => (
            <Icon name="bell" size={icons.tiny} color={color} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <SettingsIcon name="settings-outline" size={icons.tiny} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: true }}
    >
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function MainStack() {
  const globalState = useContext(store);

  return (
    <>
      {globalState.state.userToken !== null
        ?
        <Stack.Navigator
          screenOptions={{ gestureEnabled: true, headerShown: true }}
        >
          <Stack.Screen
            name="Chamados"
            component={(HomeTabs)}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Details"
            component={Details}
            options={{
              title: 'Detalhes do chamado',
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
            name="ClientScreen"
            component={ClientScreen}
            options={{
              headerShown: false,
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
            name="Search"
            component={SearchScreen}
            options={{
              headerShown: true,
              title: 'Pesquisar',
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
            name="CTO_Details"
            component={CTODetails}
            options={{
              headerShown: true,
              title: 'CTO-9999',
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
        :
        <AuthStack />
      }
    </>

  );
}

