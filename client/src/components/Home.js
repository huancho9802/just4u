import React from "react";
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
        <div>
            <h1>Home</h1>
            <Link to='/signin'>SignIn</Link>
            <Link to='/signup'>SignUp</Link>
        </div>
    )
  }
}

export default Home;
