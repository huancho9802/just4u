import React from "react";

// create context
const AppContext = React.createContext();

// auth reducer
export const reducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };
    case "SIGNOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: undefined,
      };
    case "LOADING_TRUE":
      return {
        ...state,
        loading: true,
      };
    case "LOADING_FALSE":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default AppContext;
