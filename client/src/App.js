import React from 'react'; 

//SignIn components, also includes toggle for SignUp
import SignIn from './components/SignIn'

//SignUp Page component
import SignUp from './components/SignUp';

import './App.css';

//import React routing features
import {
    BrowserRouter as Router,
    Route
} from "react-router-dom";

class App extends React.Component {

    // Render app page
    render() {
        return (
            <div>
                <Router>
                        <Route exact path="/" component={SignIn} />
                        <Route path="/signup" component={SignUp} />
                </Router>
            </div>
        );
    }
}

export default App;