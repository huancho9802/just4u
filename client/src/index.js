import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AuthContext, { authReducer } from "./context/AuthContext";

// Main Component
function Main() {
  // initialize the store and dispatch features 
  const [store, dispatch] = React.useReducer(authReducer, { isAuthenticated: false });

  return (
    <AuthContext.Provider value={{ store, dispatch }}>
      <App />
    </AuthContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
