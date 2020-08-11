// material-ui components
import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link, Redirect } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import stateHashes from "../static/states_hash";

//Additional stylesheet
import "../App.css";

//Logo image
import Logo from "../static/Logo.png";

import api from "../api/api.js";

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      firstName: this.props.prevFirstName,
      middleName: this.props.prevMiddleNameName,
      lastName: this.props.prevLastName,
      email: this.props.prevEmail,
      password: "",
      state: this.props.prevState,
      showPassword: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    // custom rule will have name 'validPassword'
    ValidatorForm.addValidationRule("validPassword", (value) => {
      if (
        value.length < 8 ||
        value.toUpperCase() === value ||
        value.toLowerCase() === value ||
        !/[0-9]/.test(value)
      ) {
        return false;
      }
      return true;
    });
    // rule "isState"
    ValidatorForm.addValidationRule("isState", (value) => {
      if (!Object.keys(stateHashes).includes(value)) {
        return false;
      }
      return true;
    });
  }

  componentWillUnmount() {
    // remove rules when it is not needed
    ValidatorForm.removeValidationRule("validPassword");
    ValidatorForm.removeValidationRule("isState");
  }

  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleClickShowPassword() {
    this.setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  }

  handleSubmit(event) {
    event.preventDefault();
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      state,
    } = this.state;
    api
      .post("/auth/signup", {
        email,
        password,
        firstName,
        middleName,
        lastName,
        state,
      })
      .then((response) => {
        console.log(response.data.message);
        this.setState({ success: true }, () => {
          this.props.onSuccess();
        });
      })
      .catch((err) => {
        console.error(err);
        this.props.onError(
          err.response.data.message,
          email,
          firstName,
          middleName,
          lastName,
          state
        );
      });
  }

  //render
  render() {
    const {
      email,
      password,
      firstName,
      middleName,
      lastName,
      state,
      showPassword,
    } = this.state;

    if (this.state.success) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        {
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
              <img className="LogoSignUp" src={Logo} alt="just4u logo"/>
              <Typography
                component="h1"
                variant="h5"
                style={{
                  display: "block",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                Sign Up
              </Typography>
              <Typography
                component="h2"
                variant="body2"
                color="error"
                id="message"
              >
                {this.props.message}
              </Typography>
              <p></p>
              <ValidatorForm onSubmit={this.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextValidator
                      autoComplete="fname"
                      name="firstName"
                      variant="outlined"
                      fullWidth
                      id="firstName"
                      label="First Name"
                      value={firstName}
                      onChange={this.handleChange}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextValidator
                      autoComplete="mname"
                      name="middleName"
                      variant="outlined"
                      fullWidth
                      id="middleName"
                      label="Middle Name/Initial"
                      value={middleName}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      value={lastName}
                      onChange={this.handleChange}
                      validators={["required"]}
                      errorMessages={["This field is required"]}
                      autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      validators={["required", "isEmail"]}
                      errorMessages={[
                        "This field is required",
                        "Invalid email",
                      ]}
                      value={email}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      id="password"
                      variant="outlined"
                      fullWidth
                      name="password"
                      label="Password"
                      validators={["required", "validPassword"]}
                      errorMessages={[
                        "This field is required",
                        "Password must have at least 8 characters, 1 lowercase character, 1 uppercase character, and 1 digit.",
                      ]}
                      autoComplete="current-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={this.handleChange}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => this.handleClickShowPassword()}
                            >
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      variant="outlined"
                      fullWidth
                      name="state"
                      label="State/Territory (two-letter code, e.g. CA, DC, TX)"
                      id="state"
                      validators={["required", "isState"]}
                      errorMessages={[
                        "This field is required",
                        "Invalid state/territory abbreviation. At the moment we only support users from US states and territories.",
                      ]}
                      value={state}
                      onChange={this.handleChange}
                      autoComplete="state"
                      inputProps={{
                        maxLength: 2,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}></Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign Up
                </Button>
                <p></p>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link
                      to="/"
                      onClick={this.ChangeToSignInPage}
                      variant="body2"
                    >
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </ValidatorForm>
            </div>
          </Container>
        }
      </div>
    );
  }
}
export default SignUp;
