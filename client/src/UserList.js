import React, { Component } from 'react';

class UserList extends Component {
  render() {
    const { userData } = this.props

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

export default UserList;