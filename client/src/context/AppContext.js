import React, { useReducer } from "react";

// initial state
const initialState = {
  isAuthenticated: false,
  isTimedOut: false,
};

const initialAppStateContext = {
  ...initialState,
  handleAuthenticateUser: () => {},
  handleLogoutUser: () => {},
};

const AppContext = React.createContext(initialAppStateContext);

export const AppContextProvider = AppContext.Provider;
export const AppContextConsumer = AppContext.Consumer;

export default AppContext;
