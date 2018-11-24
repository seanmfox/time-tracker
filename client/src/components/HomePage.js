import React, { Component } from "react";
import SignIn from "./SignIn";
import { Link } from "react-router-dom";
import clock from "../images/clock.svg"

class HomePage extends Component {
  onUserSet = user => {
    this.props.validUser(user);
  };

  render() {
    return (
      <div className="signin-page-container">
        <h2>Log In</h2>
        <SignIn setUser={role => this.onUserSet(role)} />
        <Link to="/signup" className="signup-link">
          Sign up for a new account
        </Link>
        <img src={clock} alt="clock" className="clock" />
      </div>
    );
  }
}

export default HomePage;
