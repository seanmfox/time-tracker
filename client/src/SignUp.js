import React, { Component } from 'react';
import UserForm from './UserForm'
import { withRouter } from 'react-router-dom'

class SignUp extends Component {
  state = {
    fname: '',
    lname: '',
    email: '',
    password: '',
    verifyPassword: '',
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
    const { fname, lname, email, password, verifyPassword, userList } = this.state;
    if (!fname || !lname || !email || !password || !verifyPassword) return;
    if (userList.map(user => user.email).includes(email)) return;
    if (password !== verifyPassword) return;
    this.submitNewUser();
  }

  submitNewUser = () => {
    const { fname, lname, email, password } = this.state;
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fname, lname, email, password }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.setState({ fname: '', lname: '', email: '', password: '', verifyPassword: '', error: null });
        this.props.history.push('/');
      }
    });
  }

  render() {
    const { fname, lname, email, password, verifyPassword } = this.state
    const { userRole } = this.props

    return (
      <div>
        {!userRole &&
        <UserForm
          fname={fname}
          lname={lname}
          email={email}
          password={password}
          verifyPassword={verifyPassword}
          handleChangeText={this.onChangeText}
          submitUser={this.submitUser}
        />
        }
      </div>
    );
  }
}

export default withRouter(SignUp);