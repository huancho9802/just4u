//material-ui components
import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

//Additional stylesheet
import "../App.css";

//Logo image
import Logo from "../static/Logo.png";

import api from "../api/api.js";

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    api
      .get("/auth/signin")
      .then((response) => {
        console.log(response);
        this.setState({ message: response.data.message });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //render material-ui template
  render() {
    return (
      <div>
        {
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
              <img className="Logo" src={Logo} alt="just4u logo" />
              <Typography component="h1" variant="h5" className="Logo">
                {this.state.message}
              </Typography>
              <form>
                <TextField
                  required
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                />
                <TextField
                  required
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                />
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
                    <Link href="reset-password" variant="body2">
                      Reset password
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="signup"
                      onClick={this.ChangeToSignUpPage}
                      variant="body2"
                    >
                      {"Don't have an account? Sign Up"}
                    </Link>
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
