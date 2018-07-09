import React, { Component } from 'react';
import UserBox from './UserBox';
import SignIn from './SignIn';
import SignUp from './SignUp';
import 'whatwg-fetch';
// import { Route, Redirect } from 'react-router-dom'
// import CommentBox from './CommentBox';

class App extends Component {
  state = {
    validUser: false,
    username: '',
    password: '',
    error: '',
    userData: []
  }

  componentDidMount() {
    this.loadUsersFromServer();
  }

  loadUsersFromServer = () => {
    fetch('/api/users/')
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else this.setState({ userData: res.userData });
    });
  }


  signInUser = (e) => {
    e.preventDefault()
    const { username, password, validUser } = this.state;
    if (!username || !password) return;
    if (!validUser) {
      this.newSignIn();
    }
  }

  newSignIn = () => {
    const { username, password } = this.state;
    fetch('/api/usersignin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else if (res.validUser) this.setState({ validUser: true, username: '', password: '', error: null });
    });
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  signOut = () => {
    this.setState({ validUser: false })
  }

  userDataUpdate = (data) => {
    this.setState({ userData: data })
  }

  render() {
    const { validUser, username, password, userData } = this.state

    return (
      <div>
        {/* <CommentBox /> */}

          {!validUser &&

            <SignIn 
            signInUser={this.signInUser}
            handleChangeText={this.onChangeText}
            username={username}
            password={password}
          />}
      


          {validUser &&
            <UserBox
            userData={userData}
            />}

        
        {validUser && <p>You are signed in!<button onClick={() => this.signOut()}>Sign Out</button></p>}

        {!validUser && <SignUp
            onUserDataUpdate={(data) => {this.userDataUpdate(data)}}
            userData={ userData }
          />
        }
      </div>
    );
  }
}

export default App;