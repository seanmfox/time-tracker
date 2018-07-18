import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';

class Admin extends Component {
  
  state = {
    userData: [],
    error: null
  }

  componentDidMount() {
    this.loadUserDataFromServer()
  }

  loadUserDataFromServer = () => {
    fetch('/api/userdata/')
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else this.setState({ userData: res.userData });
    });
  }

  signOut = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('userRole')
    this.props.validUserRole('')
    this.props.history.push('/');
  }
  
  render() {
    const { userData } = this.state
    const { weekStart } = this.props
    return (
      <div>
        <button onClick={() => this.signOut()}>Sign Out</button>
        <h1>You found the admin page!</h1>
        <UserList 
          userData={userData}
          weekStart={weekStart}
        />

      </div>
    );
  }
}

export default withRouter(Admin);