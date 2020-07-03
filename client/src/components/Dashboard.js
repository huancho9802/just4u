import React from "react";
import { Route, BrowserRouter, Switch, Link } from "react-router-dom";

class Dashboard extends React.Component {
  render() {
    // declare match props
    const { match } = this.props;

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path={`${match.path}/`} exact>
              <h1>Dashboard</h1>
              <Link to={`${match.url}/tasks`}>Tasks</Link>
              <Link to={`${match.url}/calendar`}>Calendar</Link>
            </Route>

            <Route path={`${match.path}/tasks`} exact>
              <h1>Tasks</h1>
            </Route>

            <Route path="*">
              <h1>404 Not Found</h1>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default Dashboard;
