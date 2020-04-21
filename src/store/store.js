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
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider }