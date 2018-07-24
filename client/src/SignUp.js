import React, { Component } from 'react';
import UserForm from './UserForm'
import { withRouter } from 'react-router-dom'

class SignUp extends Component {
  state = {
    email: '',
    password: '',
    error: '',
    userList: []
  }

  componentDidMount() {
    this.loadUsersFromServer();
  }

  loadUsersFromServer = () => {
    fetch('/api/users/')
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else this.setState({ userList: res.userList });
    });
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitUser = (e) => {
    e.preventDefault();
    const { email, password, userList } = this.state;
    if (!email || !password) return;
    if (userList.map(user => user.email).includes(email)) return;
    this.submitNewUser();
  }

  submitNewUser = () => {
    const { email, password } = this.state;
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.setState({ email: '', password: '', error: null });
        this.props.history.push('/');
      }
    });
  }

  render() {
    const { email, password } = this.state
    const { userRole } = this.props

    return (
      <div>
        {!userRole &&
        <UserForm
          email={email}
          password={password}
          handleChangeText={this.onChangeText}
          submitUser={this.submitUser}
        />
        }
      </div>
    );
  }
}

export default withRouter(SignUp);