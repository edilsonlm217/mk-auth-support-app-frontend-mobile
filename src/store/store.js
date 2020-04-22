import React, {createContext, useReducer} from 'react';

const initialState = {
  token: null,
  employee_id: null,
  isSigned: false,
  server_ip: null,
  server_port: null,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'signIn':
        const newState = { 
          token: action.payload.token,
          employee_id: action.payload.employee_id,
          isSigned: true,
          server_ip: action.payload.server_ip,
          server_port: action.payload.server_port,
        }
        
        return newState;

      case 'setTokenFromAsync':
        const partialState = { 
          token: action.payload.token,
          employee_id: action.payload.employee_id,
          isSigned: true,
          server_ip: action.payload.server_ip,
          server_port: action.payload.server_port,
        }
        
        return partialState;

      case 'logout':
        const logoutState = { 
          token: null,
          employee_id: null,
          isSigned: false,
          server_ip: null,
          server_port: null,
        }
        
        return logoutState;

      case 'changeServerConfig':
        const changedState = { 
          token: state.token,
          employee_id: state.employee_id,
          isSigned: state.isSigned,
          server_ip: action.payload.server_ip,
          server_port: action.payload.server_port,
        }
        
        return changedState;

      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }