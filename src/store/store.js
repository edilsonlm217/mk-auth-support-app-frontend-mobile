import React, {createContext, useReducer, useEffect} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
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
          userToken: action.token,
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
        const { login, password } = data;
        
        const response = await axios.post(`http://10.0.2.2:3333/sessions`, {
          login,
          password,
        });
        
        const { token } = response.data;

        await AsyncStorage.setItem('@auth_token', response.data.token.toString());

        dispatch({ type: 'SIGN_IN', token: token });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      
    }), []);

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { store, StateProvider }