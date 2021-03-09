import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SettingsIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { store } from './store/store';
import { icons } from './styles/index';

import { Home } from './pages/Home/index';
import Details from './pages/Details/index';
import CTOMapping from './pages/CTOMapping/index';
import AuthScreen from './pages/AuthScreen/index';
import CTODetails from './pages/CTODetails/index';
import NotesScreen from './pages/NotesScreen/index';
import SplashScreen from './pages/SplashScreen/index';
import SearchScreen from './pages/SearchScreen/index';
import ClientScreen from './pages/ClientScreen/index';
import OverdueScreen from './pages/OverdueScreen/index';
import SettingsScreen from './pages/SettingsScreen/index';
import PickNewLocation from './pages/PickNewLocation/index';
import InstallationRequestDetails from './pages/InstallationRequestDetails/index';

import { fonts } from './styles/index';
import api from './services/api';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function AppTabs() {
  const globalStore = useContext(store);
  const { isAdmin } = globalStore.state;

  return (
    <Tab.Navigator
      lazy={false}
      tabBarOptions={{
        keyboardHidesTabBar: true,
        labelStyle: {
          fontSize: fonts.small,
        },
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

      {isAdmin &&
        <Tab.Screen
          name="Atrasados"
          component={OverdueScreen}
          options={{
            tabBarLabel: 'Em atraso',
            tabBarIcon: ({ color }) => (
              <Icon name="file-alert" size={icons.tiny} color={color} />
            ),
          }}
        />
      }

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

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Ajustes',
          tabBarIcon: ({ color }) => (
            <SettingsIcon
              name="settings-outline"
              size={icons.tiny}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: true }}>
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function SignedStack() {
  const globalStore = useContext(store);

  const [state, setState] = useState({});

  async function fetchStructure() {
    const { tenantID, employee_id } = globalStore.state;
    try {
      const response = await api.get(`app/structure?tenant_id=${tenantID}&employee_id=${employee_id}`);

      setState(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  useEffect(() => {
    fetchStructure();
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{ gestureEnabled: true, headerShown: true }}>
      <Stack.Screen
        name="Chamados"
        component={AppTabs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          title: 'Chamado de suporte',
          headerStyle: {
            backgroundColor: '#337AB7',
          },
          headerTintColor: '#FFF',
          headerTransparent: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: fonts.huge,
            marginLeft: -20,
          },
        }}
      />

      <Stack.Screen
        name="InstallationRequestDetails"
        component={InstallationRequestDetails}
        options={{
          title: 'Chamado de instalação',
          headerStyle: {
            backgroundColor: '#337AB7',
          },
          headerTintColor: '#FFF',
          headerTransparent: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: fonts.huge,
            marginLeft: -20,
          },
        }}
      />

      <Stack.Screen
        name="NotesScreen"
        component={NotesScreen}
        options={{
          title: 'Notas',
          headerStyle: {
            backgroundColor: '#337AB7',
          },
          headerTintColor: '#FFF',
          headerTransparent: false,
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
        initialParams={{ showClientFinancing: state.showClientFinancing }}
        options={({ route }) => ({
          title: route.params.client_name,
          headerStyle: {
            backgroundColor: '#337AB7',
            elevation: 0,
          },
          headerTintColor: '#FFF',
          headerTransparent: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
            marginLeft: -20,
          },
        })}
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
  );
}

export default function MainStack() {
  const globalState = useContext(store);

  if (globalState.state.isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      {globalState.state.userToken !== null
        ? <SignedStack />
        : <AuthStack />
      }
    </>
  );
}
