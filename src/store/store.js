import React, { createContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
import { Alert } from 'react-native';

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  employee_id: null,
  isAdmin: false,
  tenantID: null,
  restoreKey: true,
  notification_count: 0,
  oneSignalUserId: null,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch (action.type) {
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.payload.token,
          employee_id: action.payload.employee_id,
          isAdmin: action.payload.isAdmin,
          tenantID: action.payload.tenantID,
          // restoreKey: action.payload.rememberPassword,
          oneSignalUserId: action.payload.oneSignalUserId,
        };

      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.payload.userToken,
          employee_id: action.payload.employee_id,
          isLoading: false,
          isAdmin: action.payload.isAdmin,
          tenantID: action.payload.tenantID,
          restoreKey: action.payload.restoreKey == 'true' ? true : false,
          oneSignalUserId: action.payload.oneSignalUserId,
        };

      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          isAdmin: null,
        };

      case 'SAVE_KEY_PREFERENCES':
        return {
          ...prevState,
          restoreKey: action.payload.restoreKeyStatus,
        };

      case 'CHANGE_SERVER_CONFIG':
        const changedState = {
          ...prevState,
        };

        return changedState;

      case 'setNotification':
        return {
          ...prevState,
          notification_count: action.payload.notification_count,
        };

      default:
        throw new Error();
    }
  }, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let employee_id;
      let isAdmin;
      let restoreKey;
      let tenantID;
      let oneSignalUserId;

      try {
        userToken = await AsyncStorage.getItem('@auth_token');
        employee_id = await AsyncStorage.getItem('@employee_id');
        isAdmin = await AsyncStorage.getItem('@isAdmin');
        restoreKey = await AsyncStorage.getItem('@restore_key_status');
        tenantID = await AsyncStorage.getItem('@tenantID');
        oneSignalUserId = await AsyncStorage.getItem('@OneSignalUserId');

        if (isAdmin === 'false') {
          isAdmin = false;
        } else if (isAdmin === 'true') {
          isAdmin = true;
        }
      } catch (e) {
        // Restoring token failed
      }

      dispatch({
        type: 'RESTORE_TOKEN',
        payload: {
          userToken,
          employee_id,
          isAdmin,
          restoreKey,
          tenantID,
          oneSignalUserId,
        },
      });
    };

    bootstrapAsync();
  }, []);

  const methods = React.useMemo(
    () => ({
      signIn: async data => {
        const { login, password, tenant_id } = data;

        try {
          const response = await api.post(
            `sessions?tenant_id=${tenant_id}`,
            {
              login,
              password,
            },
            {
              timeout: 10000,
            },
          );

          const { token, user } = response.data;

          const auth_token_key = [
            '@auth_token',
            response.data.token.toString(),
          ];
          const employee_id_key = ['@employee_id', user.employee_id.toString()];
          const isAdmin = ['@isAdmin', user.isAdmin.toString()];
          const tenantID = ['@tenantID', tenant_id];

          const oneSignalUserId = await AsyncStorage.getItem(
            '@OneSignalUserId',
          );

          try {
            await AsyncStorage.multiSet([
              auth_token_key,
              employee_id_key,
              isAdmin,
              tenantID,
            ]);
          } catch (e) {
            console.warn(e);
            Alert.alert('Erro', 'Não foi possível salvar dados na Storage');
          }

          dispatch({
            type: 'SIGN_IN',
            payload: {
              token,
              employee_id: user.employee_id,
              isAdmin: user.isAdmin,
              tenantID: tenant_id,
              oneSignalUserId,
            },
          });

          return true;
        } catch (err) {
          console.warn(err);
          if (err.message.includes('401')) {
            Alert.alert('Erro', 'Usuário ou senha inválidos');
          } else {
            Alert.alert(
              'Erro de conexão',
              'Não foi possível encontrar o servidor',
            );
          }
          return true;
        }
      },

      saveTenantKey: async data => {
        const restoreKeyStatus = data;

        try {
          const saveToStorage = [
            '@restore_key_status',
            restoreKeyStatus.toString(),
          ];

          await AsyncStorage.multiSet([saveToStorage]);
        } catch (error) {
          console.log('Deu erro na hora de salvar no AsyncStorage');
        }

        dispatch({
          type: 'SAVE_KEY_PREFERENCES',
          payload: {
            restoreKeyStatus,
          },
        });
      },

      signOut: () => dispatch({ type: 'SIGN_OUT' }),

      changeConfig: async data => {
        try {
          const server_ip_key = ['@server_ip', data.serverIP];
          const server_port_key = ['@server_port', data.serverPort];

          await AsyncStorage.multiSet([server_ip_key, server_port_key]);
        } catch (e) {
          Alert.alert('Erro', 'Não foi possível salvar dados na Storage');
        }

        dispatch({
          type: 'CHANGE_SERVER_CONFIG',
          payload: {
            server_ip: data.serverIP,
            server_port: data.serverPort,
          },
        });
      },
      setNotificationCount: data => {
        dispatch({
          type: 'setNotification',
          payload: {
            notification_count: data,
          },
        });
      },
    }),
    [],
  );

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { store, StateProvider };
