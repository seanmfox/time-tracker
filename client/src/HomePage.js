import React, { Component } from 'react';
import SignIn from './SignIn'
import { Link } from 'react-router-dom'

class HomePage extends Component {

  onUserValidation = (status) => {
    this.props.validUserStatus(status)
  }

  render() {
    
    return (
      <div className="signin-page-container">
        <h2>Log In</h2>
        <SignIn 
          validateUser={(status) => this.onUserValidation(status)}
          />
        <Link to='/signup' className="signup-link">Sign up for a new account</Link>
      </div>
    );
  }
}

export default HomePage;