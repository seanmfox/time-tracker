import React, { Component } from "react";
import SignIn from "./SignIn";
import { Link } from "react-router-dom";

class HomePage extends Component {
  onUserRole = role => {
    this.props.validUserRole(role);
  };

  render() {
    return (
      <div className="signin-page-container">
        <h2>Log In</h2>
        <SignIn setUserRole={role => this.onUserRole(role)} />
        <Link to="/signup" className="signup-link">
          Sign up for a new account
        </Link>
      </div>
    );
  }
}

export default HomePage;
