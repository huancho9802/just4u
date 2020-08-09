import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from '../context/AppContext';

const PrivateRoute = ({component: Component, ...rest}) => {
    const { store } = React.useContext(AppContext)

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            store.isAuthenticated ?
                <Component {...props} />
            : <Redirect to="/" />
        )} />
    );
};

export default PrivateRoute;