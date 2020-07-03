//material-ui components
import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

//Additional stylesheet
import "../App.css";

// import Verify component
import Verify from "./Verify";

//Logo image
import Logo from "../static/Logo.png";

// import api
import api from "../api/api.js";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      stage: "signin",
      showPassword: false,
      verificationError: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.successVerification = this.successVerification.bind(this);
    this.errorVerification = this.errorVerification.bind(this);
  }

  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    api
      .post("/auth/signin", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        console.log(response.data.message);
        if (response.data.isVerified) {
          this.props.onSuccess();
        } else {
          this.setState({ stage: "verification" });
        }
      })
      .catch((err) => {
        console.error(err);
        this.props.onError(err.response.data.message);
      });
  }

  handleClickShowPassword() {
    this.setState((prevState) => ({
      ...prevState,
      showPassword: !prevState.showPassword,
    }));
  }

  errorVerification(message) {
    this.setState({ verificationError: message });
  }

  successVerification() {
    this.props.onSuccess();
  }

  render() {
    const { showPassword, email, password, verificationError, stage } = this.state;
    const messageColor = this.props.messageColor;

    if (stage === "verification") {
      return (
        <div>
          <Verify email={email} error={verificationError} onError={this.errorVerification} onSuccess={this.successVerification}/>
        </div>
      );
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
                Sign In
              </Typography>
              <Typography
                component="h2"
                variant="body2"
                id="message"
                style={{
                  color: messageColor,
                }}
              >
                {this.props.message}
              </Typography>

              <form onSubmit={this.handleSubmit}>
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
                <TextField
                  id="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
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
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <p></p>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Sign In
                </Button>
                <p></p>
                <Grid container className="justify-content-md-center">
                  <Grid item xs>
                    <Link to="/forgot-password">Forgot password</Link>
                  </Grid>
                  <Grid item>
                    <Link to="/signup">Don't have an account? Sign Up</Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        }
      </div>
    );
  }
}
export default SignIn;
