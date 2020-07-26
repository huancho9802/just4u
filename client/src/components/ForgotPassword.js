//material-ui components
import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

//Additional stylesheet
import "../App.css";

//Logo image
import Logo from "../static/Logo.png";

// import api
import api from "../api/api.js";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: this.props.stage,
      email: this.props.email,
      resetCode: "",
      newPassword: "",
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
  }

  componentWillUnmount() {
    // remove rules when it is not needed
    ValidatorForm.removeValidationRule("validPassword");
  }

  handleClickShowPassword() {
    this.setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  }

  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  resendCode() {
    api
      .post("/auth/reset-password", {
        email: this.state.email,
      })
      .then(() => {
        alert(`New reset code sent to ${this.state.email}`);
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred");
      });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { stage, email, resetCode, newPassword } = this.state;
    // handle submit for different stages
    switch (stage) {
      case "email":
        api
          .post("/auth/reset-password", {
            email,
          })
          .then(() => {
            this.props.onSuccess("resetCode", email);
          })
          .catch((err) => {
            console.error(err);
            this.props.onError(err.response.data.message);
          });
        break;
      case "resetCode":
        api
          .post("/auth/confirm-reset-code", {
            email,
            resetCode,
          })
          .then(() => {
            this.props.onSuccess("newPassword", email);
          })
          .catch((err) => {
            console.error(err);
            this.props.onError(err.response.data.message);
          });
        break;
      case "newPassword":
        api
          .post("/auth/new-password", {
            email,
            newPassword,
          })
          .then(() => {
            alert("New password set. Click OK to redirect to Sign In page.");
            this.props.onSuccess("email", "");
            window.location.pathname = "/";
          })
          .catch((err) => {
            console.error(err);
            this.props.onError(err.response.data.message);
          });
        break;
      default:
        break;
    }
  }

  render() {
    const { stage, email, resetCode, newPassword, showPassword } = this.state;

    let inputField, promptMessage;
    switch (
      stage // conditional rendering for different stages
    ) {
      case "email":
        promptMessage = "Please enter your email";
        inputField = (
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={email}
            onChange={this.handleChange}
          />
        );
        break;
      case "resetCode":
        promptMessage = "Please enter the reset code sent to " + email;
        inputField = (
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="resetCode"
            label="Reset Code"
            name="resetCode"
            value={resetCode}
            onChange={this.handleChange}
          />
        );
        break;
      case "newPassword":
        promptMessage = "Please enter your new password";
        inputField = (
          <TextValidator
            id="newPassword"
            variant="outlined"
            fullWidth
            name="newPassword"
            label="New Password"
            validators={["required", "validPassword"]}
            errorMessages={[
              "This field is required",
              "Password must have at least 8 characters, 1 lowercase character, 1 uppercase character, and 1 digit.",
            ]}
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={this.handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => this.handleClickShowPassword()}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        );
        break;
      default:
        break;
    }

    return (
      <div>
        {
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
              <img className="Logo" src={Logo} alt="just4u logo" />
              <Typography
                component="h1"
                variant="h5"
                style={{
                  display: "block",
                  margin: "auto",
                  textAlign: "center",
                }}
              >
                Reset Password
              </Typography>
              <p></p>
              <Typography component="h2" variant="body1" id="promptMessage">
                {promptMessage}
              </Typography>
              <p></p>
              <Typography
                component="h2"
                variant="body2"
                id="errorMessage"
                color="error"
              >
                {this.props.errorMessage}
              </Typography>
              <p></p>
              <ValidatorForm onSubmit={this.handleSubmit}>
                {inputField}
                <p></p>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Submit
                </Button>
                <p></p>
                <Grid container className="justify-content-md-center">
                  <Grid item xs>
                    {stage === "resetCode" ? (
                      <Link to="/forgot-password" onClick={() => this.resendCode()}>Resend code</Link>
                    ) : (
                      <p></p>
                    )}
                  </Grid>
                  <Grid item>
                    <Link to="/">Sign In</Link>
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
export default ForgotPassword;
