//material-ui components
import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

//SignUp Page component
import SignUp from './SignUp';

//Additional stylesheet
import '../App.css';

//Logo image
import Logo from '../static/Logo.png';


class SignIn extends React.Component {

    // initiate state for SignUp page
    state = {
        isSignUp: false
    }

    // handle SignUp event
    ChangeToSignUpPage = formSubmitEvent => {
        formSubmitEvent.preventDefault();
        formSubmitEvent.preventDefault();
        this.setState(
            {isSignUp : true}
        )
    }

    //render material-ui template
    render() {
        return (
            <div>
                {
                    !this.state.isSignUp ?
                        (
                            <Container component="main" maxWidth="xs">
                                <CssBaseline />
                                <div>
                                    <img className="Logo" src={Logo} alt="just4u logo"/>
                                    <Typography component="h1" variant="h5" className="Logo">
                                        Sign in
                                    </Typography>
                                    <form >
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
                                        <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember me"
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
                                                <Link href="#" variant="body2">
                                                    Forgot password?
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Link href="#" onClick={this.ChangeToSignUpPage} variant="body2">
                                                    {"Don't have an account? Sign Up"}
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </div>
                            </Container>
                      ) :
                        <SignUp />
            }
            </div>
        );
    }
}
export default SignIn;