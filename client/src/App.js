import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route
  } from "react-router-dom";

//import component
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'

import './App.css';

import api from './api/api.js'

class App extends React.Component {

    state = {
        isAuthenticated: false
    }

    componentDidMount() {
        api.get('/auth')
           .then((response) => {
               console.log(response)
               this.setState({isAuthenticated: response.data.isAuthenticated})
           })
           .catch()
    }

    // Render app page
    render() {
        return (
            <BrowserRouter>
                <div>
                <Switch>
                    <Route path="/signup" exact>
                        <SignUp />
                    </Route>
                    <Route path="/" exact>
                        <SignIn />
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

export default App;