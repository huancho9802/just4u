import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    const { store } = React.useContext(AuthContext)

    return (
        <Route {...rest} render={props => (
            store.isAuthenticated ?
                <Redirect to="/0" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;