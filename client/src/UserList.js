import React, { Component } from 'react';
import WeeklyRecap from './WeeklyRecap';

class UserList extends Component {
  state = {
    selectedUser: ''
  }

  handleSelectChange = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  render() {
    const { selectedUser } = this.state
    const { userData, weekStart, userRole } = this.props

    return (
      <div>
        {userData.length !== 0 ?
        (<select value={selectedUser} name='selectedUser' onChange={this.handleSelectChange}>
          <option></option>
        {userData.map(user => (
          <option key={user._id} value={user._id}>{user.fname} {user.lname}</option>
        ))}
        </select>)
         : (<p>There were no users</p>)
        }
        {selectedUser !== '' && 
          <WeeklyRecap 
          userRole={userRole}
            weekStart={weekStart}
            activities={userData.find(user => selectedUser === user._id)['activities']}
          />
        }
      </div>
    );
  }
}

export default UserList;