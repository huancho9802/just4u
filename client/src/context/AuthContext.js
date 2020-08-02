import React from "react";

// create context
const AuthContext = React.createContext();

// auth reducer
export const authReducer = (state, action) => {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        isAuthenticated: true,
      };
    case "SIGNOUT":
      return {
        ...state,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default AuthContext;
