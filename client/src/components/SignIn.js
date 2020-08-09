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
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

//Additional stylesheet
import "../App.css";

// import Verify component
import Verify from "./Verify";

//Logo image
import Logo from "../static/Logo.png";

// import api
import api from "../api/api.js";
import AppContext from "../context/AppContext";

// styling
const styles = (theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage:
      "url(https://cdn.pixabay.com/photo/2017/02/12/14/00/justice-2060093_960_720.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      stage: "signin",
      showPassword: false,
      verificationError: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.successVerification = this.successVerification.bind(this);
    this.errorVerification = this.errorVerification.bind(this);
  }

  static contextType = AppContext;

  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { dispatch } = this.context;
    api
      .post("/auth/signin", {
        email: this.state.email,
        password: this.state.password,
      })
      .then((response) => {
        console.log(response.data.message);
        if (response.data.isVerified) {
          this.props.onSuccess();
          dispatch({ type: "SIGNIN" });
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
    const {
      showPassword,
      email,
      password,
      verificationError,
      stage,
    } = this.state;
    const { messageColor, classes } = this.props;

    if (stage === "verification") {
      return (
        <div>
          <Verify
            email={email}
            error={verificationError}
            onError={this.errorVerification}
            onSuccess={this.successVerification}
          />
        </div>
      );
    }

    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
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
          </div>
        </Grid>
      </Grid>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SignIn);
