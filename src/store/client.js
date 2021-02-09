import React, { createContext, useReducer, useMemo } from 'react';

const initial_state = {
  client: {},
  isLoading: false,
};

const clientStore = createContext(initial_state);
const { Provider } = clientStore;

const ClientStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initial_state);

  function reducer(state, action) {
    switch (action.type) {
      case 'setIsLoading':
        return {
          ...state,
          isLoading: true,
        };

      case 'setClientData':
        return {
          ...state,
          client: action.payload.client,
          isLoading: false,
        };
    }
  }

  const methods = useMemo(
    () => ({
      setIsLoading: () => {
        dispatch({ type: 'setIsLoading' });
      },
      setClientData: data => {
        dispatch({
          type: 'setClientData',
          payload: {
            client: data,
          },
        });
      },
    }),
    [],
  );

  return <Provider value={{ state, methods }}>{children}</Provider>;
};

export { clientStore, ClientStateProvider };
