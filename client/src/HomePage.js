import React, { Component } from 'react';
import SignIn from './SignIn'
import { Link } from 'react-router-dom'

class HomePage extends Component {

  onUserValidation = (status) => {
    this.props.validUserStatus(status)
  }

  render() {
    
    return (
      <div>
        <SignIn 
          validateUser={(status) => this.onUserValidation(status)}
          />
        <Link to='/signup'>Sign up for a new account!</Link>
      </div>
    );
  }
}

export default HomePage;