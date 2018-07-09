import React, { Component } from 'react';
import 'whatwg-fetch';
import './UserBox.css';

class UserBox extends Component {

  render() {
    const { userData } = this.props
    console.log(userData)
   
    return (
      <div>
        {userData.length !== 0 ? 
        (userData.map(user => (
          <p key={user._id}>{user.username}</p>
        ))) : (<p>There were no users</p>)
        }
      </div>
    );
  }
}

export default UserBox;