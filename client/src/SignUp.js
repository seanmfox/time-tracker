import React, { Component } from 'react';
import UserForm from './UserForm'
import { withRouter } from 'react-router-dom'

class SignUp extends Component {
  state = {
    username: '',
    password: '',
    error: ''
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  submitUser = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    if (!username || !password) return;
    this.submitNewUser();
  }

  submitNewUser = () => {
    const { username, password } = this.state;
    const userData = [...this.props.userData, { username, password, _id: Date.now().toString() }];
    this.props.onUserDataUpdate(userData);
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.setState({ username: '', password: '', error: null });
        this.props.history.push('/');
      }
    });
  }

  render() {
    const { username, password } = this.state
    const { validUser } = this.props

    return (
      <div>
        {!validUser &&
        <UserForm
          username={username}
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