import React, { Component } from 'react';
import 'whatwg-fetch';
import './UserBox.css';
import { withRouter } from 'react-router-dom';

class Dashboard extends Component {

  signOut = () => {
    this.props.validUserStatus(false)
    this.props.history.push('/');
  }

  render() {
    const userData = (this.props.userData ? this.props.userData : this.props.location.state.userData)

    return (
      
      <div>
        {userData.length !== 0 ? 
        (userData.map(user => (
          <p key={user._id}>{user.username}</p>
        ))) : (<p>There were no users</p>)
        }
        <button onClick={() => this.signOut()}>Sign Out</button>
      </div>
    );
  }
}

export default withRouter(Dashboard);