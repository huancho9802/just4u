import React from 'react'; 

//SignIn components, also includes toggle for SignUp
import SignIn from './components/SignIn'


import './App.css';


class App extends React.Component {

    // Render app page
    render() {
        return (
            <div>
                <SignIn/>
            </div>
        );
    }
}

export default App;