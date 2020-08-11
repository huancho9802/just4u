import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import AppContext from '../context/AppContext';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    const { store } = React.useContext(AppContext)

    return (
        <Route {...rest} render={props => (
            store.isAuthenticated ?
                <Redirect to="/0" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;