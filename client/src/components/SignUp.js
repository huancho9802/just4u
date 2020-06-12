// material-ui components
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

//SignIn page component
import SignIn from './SignIn';

//Additional stylesheet
import '../App.css';

//Logo image
import Logo from '../static/Logo.png';


class SignUp extends React.Component {

        //initiate stae of SignIn page
        state = {
            isSignIn: false
        }

        //handle SignIn event
        ChangeToSignInPage = formSubmitEvent => {
            formSubmitEvent.preventDefault();
            this.setState(
                { isSignIn: true }
            )
        }

        //render material-ui template
        render() {
            return (
                <div>
                    {
                        !this.state.isSignIn ?
                            (
                                < Container component="main" maxWidth="xs" >
                                    <CssBaseline />
                                    <div>
                                        <img className="Logo" src={Logo} alt="just4u logo"/>
                                        <Typography component="h1" variant="h5" className="Logo">
                                            Sign up
                                        </Typography>
                                        <p></p>
                                        <form>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        autoComplete="fname"
                                                        name="firstName"
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="firstName"
                                                        label="First Name"
                                                        autoFocus
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="lastName"
                                                        label="Last Name"
                                                        name="lastName"
                                                        autoComplete="lname"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        id="email"
                                                        label="Email Address"
                                                        name="email"
                                                        autoComplete="email"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        variant="outlined"
                                                        required
                                                        fullWidth
                                                        name="password"
                                                        label="Password"
                                                        type="password"
                                                        id="password"
                                                        autoComplete="current-password"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <FormControlLabel
                                                        control={<Checkbox value="allowExtraEmails" color="primary" />}
                                                        label="I want to receive inspiration, marketing promotions and updates via email."
                                                    />
                                                </Grid>
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
                                                    <Link href="#" onClick={this.ChangeToSignInPage} variant="body2">
                                                        Already have an account? Sign in
                                                    </Link>
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </div>
                                </Container>
                        ) :
                        < SignIn />
                    }
                </div>
            );
        }
 }
export default SignUp;
