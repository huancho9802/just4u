import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AppContext, { reducer } from "./context/AppContext";

// initial state
const initialState = {
  isAuthenticated: false,
  loading: true,
  user: undefined,
}

// Main Component
function Main() {
  // initialize the store and dispatch features 
  const [store, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ store, dispatch }}>
      <App />
    </AppContext.Provider>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
  document.getElementById("root")
);
