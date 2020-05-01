import React, {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  server_ip: null,
  server_port: null,
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
        };

      case 'RESTORE_TOKEN':
        return {
          ...prevState,
            userToken: action.token,
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
      } catch (e) {
        // Restoring token failed
      }
      
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const methods = React.useMemo(
    () => ({
      signIn: async data => {
        const { login, password, server_ip, server_port } = data;
        console.log(server_ip);
        console.log(server_port);
        
        const response = await axios.post(`http://10.0.2.2:3333/sessions`, {
          login,
          password,
        });
        
        const { token } = response.data;

        await AsyncStorage.setItem('@auth_token', response.data.token.toString());

        dispatch({ type: 'SIGN_IN', payload: {
          token,
          server_ip,
          server_port,
        } });
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