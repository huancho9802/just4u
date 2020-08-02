import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

//import component
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Paperbase from "./components/Paperbase";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPassword from "./components/ForgotPassword";

import "./App.css";

import api from "./api/api";
import AuthContext from "./context/AuthContext";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      messageSignIn: "",
      messageSignInColor: "",
      errorMessageForgotPassword: "",
      stageForgotPassword: "email",
      emailForgotPassword: "",
      signUpError: {
        message: "",
        prevEmail: "",
        prevFirstName: "",
        prevLastName: "",
        prevState: "",
      },
    };
    this.successSignIn = this.successSignIn.bind(this);
    this.errorSignIn = this.errorSignIn.bind(this);
    this.successSignUp = this.successSignUp.bind(this);
    this.errorSignUp = this.errorSignUp.bind(this);
    this.errorForgotPassword = this.errorForgotPassword.bind(this);
    this.successStageForgotPassword = this.successStageForgotPassword.bind(
      this
    );
  }

  componentDidMount() {
    const { dispatch } = this.context;
    // handling authentication and verified status upon mounting
    api
      .get("/auth") // get server info
      .then((response) => {
        // if user is verified
        if (response.data.isVerified) {
          this.setState({ loading: false }, dispatch({ type: "SIGNIN" }));
        } else if (!response.data.isAuthenticated) {
          // if user is not signed in
          this.setState({ loading: false }, dispatch({ type: "SIGNOUT" }));
        } else if (response.data.isAuthenticated && !response.data.isVerified) {
          // signed in but unverified
          api
            .get("/auth/signout") // auto sign out user if not verified
            .then((response) => {
              this.setState({ loading: false }, dispatch({ type: "SIGNOUT" }));
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  successSignIn() {
    this.setState({
      messageSignIn: "",
      messageSignInColor: "",
    });
  }

  errorSignIn(message) {
    this.setState({ messageSignIn: message, messageSignInColor: "red" });
  }

  successSignUp() {
    this.setState({
      messageSignIn: "Signup successful. Please sign in and verify user.",
      messageSignInColor: "green",
      signUpError: {
        message: "",
        prevEmail: "",
        prevFirstName: "",
        prevLastName: "",
        prevState: "",
      },
    });
  }

  errorSignUp(message, prevEmail, prevFirstName, prevLastName, prevState) {
    this.setState({
      signUpError: {
        message,
        prevEmail,
        prevFirstName,
        prevLastName,
        prevState,
      },
    });
  }

  errorForgotPassword(message) {
    this.setState({ errorMessageForgotPassword: message });
  }

  successStageForgotPassword(nextStage, email) {
    this.setState({
      errorMessageForgotPassword: "",
      stageForgotPassword: nextStage,
      emailForgotPassword: email,
    });
  }

  // Render app page
  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <PublicRoute
              component={(props) => (
                <SignIn
                  {...props}
                  onSuccess={this.successSignIn}
                  onError={this.errorSignIn}
                  message={this.state.messageSignIn}
                  messageColor={this.state.messageSignInColor}
                />
              )}
              path="/"
              exact
            />
            <PublicRoute
              component={(props) => (
                <ForgotPassword
                  {...props}
                  stage={this.state.stageForgotPassword}
                  email={this.state.emailForgotPassword}
                  onSuccess={this.successStageForgotPassword}
                  onError={this.errorForgotPassword}
                  errorMessage={this.state.errorMessageForgotPassword}
                />
              )}
              path="/forgot-password"
              exact
            />

            <PublicRoute
              component={(props) => (
                <SignUp
                  {...props}
                  onSuccess={this.successSignUp}
                  onError={this.errorSignUp}
                  message={this.state.signUpError.message}
                  prevEmail={this.state.signUpError.prevEmail}
                  prevFirstName={this.state.signUpError.prevFirstName}
                  prevLastName={this.state.signUpError.prevLastName}
                  prevState={this.state.signUpError.prevState}
                />
              )}
              path="/signup"
              exact
            />
            <PrivateRoute component={Paperbase} path="/0" />
            <Route path="/api">
              <h1>Access Denied</h1>
            </Route>
            <Route>
              <h1>404 Not Found</h1>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

App.contextType = AuthContext;

export default App;
