import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";

//Additional stylesheet
import "../App.css";

//Logo image
import Logo from "../static/Logo.png";

// import api
import api from "../api/api.js";
import AppContext from "../context/AppContext";

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      verifyId: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  static contextType = AppContext;

  handleChange(event) {
    event.preventDefault();
    const name = event.target.name;
    const value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    const { dispatch } = this.context;
    event.preventDefault();
    api
      .post("/auth/verify", {
        email: this.props.email,
        verifyId: this.state.verifyId,
      })
      .then((response) => {
        alert(
          response.data.message + ". Click OK to continue to your Dashboard."
        );
        this.props.onSuccess();
        dispatch({ type: "SIGNIN" });
      })
      .catch((err) => {
        console.error(err);
        this.props.onError(err.response.data.message);
      });
  }

  resendId() {
    api
      .post("/auth/resend-verifyId", {
        email: this.props.email,
      })
      .then((response) => {
        alert(response.data.message + ` to ${this.props.email}`);
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred");
      });
  }

  render() {
    const { verifyId } = this.state;

    return (
      <div>
        {
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
              <img className="Logo" src={Logo} alt="just4u logo" />
              <Typography component="h1" variant="body1" id="message">
                Please enter the verification ID sent to {this.props.email}
              </Typography>
              <p></p>
              <Typography
                component="h2"
                variant="body2"
                id="error"
                color="error"
              >
                {this.props.error}
              </Typography>
              <p></p>
              <form onSubmit={this.handleSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="verifyId"
                  label="Verification ID"
                  name="verifyId"
                  value={verifyId}
                  onChange={this.handleChange}
                />
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
                  <Grid item>
                    <Link to="/" onClick={() => this.resendId()}>
                      Resend verification ID
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
export default Verify;
