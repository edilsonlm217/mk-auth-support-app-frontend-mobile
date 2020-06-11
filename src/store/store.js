import React, {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  server_ip: null,
  server_port: null,
  employee_id: null,
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((prevState, action) => {
    switch(action.type) {
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.payload.token,
          server_ip: action.payload.server_ip,
          server_port: action.payload.server_port,
          employee_id: action.payload.employee_id,
        };

      case 'RESTORE_TOKEN':
        return {
          ...prevState,
            userToken: action.payload.userToken,
            server_ip: action.payload.server_ip,
            server_port: action.payload.server_port,
            employee_id: action.payload.employee_id,
            isLoading: false,
        };

      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
        };

      case 'CHANGE_SERVER_CONFIG':
        const changedState = { 
          ...prevState,
          server_ip: action.payload.server_ip,
          server_port: action.payload.server_port,
        }
        
        return changedState;

      default:
        throw new Error();
    };
  }, initialState);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('@auth_token');
        server_ip = await AsyncStorage.getItem('@server_ip');
        server_port = await AsyncStorage.getItem('@server_port');
        employee_id = await AsyncStorage.getItem('@employee_id');
      } catch (e) {
        // Restoring token failed
      }
      
      dispatch({ type: 'RESTORE_TOKEN', payload: {
        userToken,
        server_ip,
        server_port,
        employee_id,
      }});
    };

    bootstrapAsync();
  }, []);

  const methods = React.useMemo(
    () => ({
      signIn: async data => {
        const { login, password, server_ip, server_port } = data;
        
        try {
          const response = await axios.post(`http://${server_ip}:${server_port}/sessions`, {
            login,
            password,
          });

          const { token, user } = response.data;
  
          const auth_token_key = ['@auth_token', response.data.token.toString()];
          const server_ip_key = ['@server_ip', server_ip];
          const server_port_key = ['@server_port', server_port];
          const employee_id_key = ['@employee_id', user.employee_id.toString()];
  
          try {
            await AsyncStorage.multiSet([auth_token_key, server_ip_key, server_port_key, employee_id_key]);
          } catch(e) {
            Alert.alert('Não foi possível salvar dados na Storage');
          }
  
          dispatch({ type: 'SIGN_IN', payload: {
            token,
            server_ip,
            server_port,
            employee_id: user.employee_id,
          } });

        } catch (err) {
          if (err.message.includes('401')) {
            Alert.alert('Usuário ou senha inválidos');
          } else {
            Alert.alert('Não foi possível encontrar o servidor');
          }
        }
      },
      
      signOut: () => dispatch({ type: 'SIGN_OUT' }),

      changeConfig: (data) => {
        dispatch({ type: 'CHANGE_SERVER_CONFIG', payload: {
          server_ip: data.serverIP,
          server_port: data.serverPort,
        }});
      },
      
    }), []);

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { store, StateProvider }