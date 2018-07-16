import React, { Component } from 'react';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import 'whatwg-fetch';
import { Route, Redirect } from 'react-router-dom'
import HomePage from './HomePage';
import './App.css'
import Header from './Header'
import Footer from './Footer'

class App extends Component {
  state = {
    validUser: false,
    error: '',
    userData: []
  }

  componentDidMount() {
    this.loadUsersFromServer();
    this.localStorageUpdate();
  }

  loadUsersFromServer = () => {
    fetch('/api/users/')
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else this.setState({ userData: res.userData });
    });
  }

  localStorageUpdate = () => {
    if (localStorage.getItem('validUser')) { 
      this.setState({validUser: localStorage.getItem('validUser')})
    }
  }

  setValidUser = (status) => {
    this.setState({ validUser: status })
  }

  userDataUpdate = (data) => {
    this.setState({ userData: data })
  }

  render() {
    const { validUser, userData } = this.state

    return (
      <div className="app">
        <Header />
        <Route exact path="/" render={() => (
          validUser ? (
            <Redirect to={{
              pathname: "/dashboard",
              state: { userData: userData }}}/>
          ) : (
            <HomePage
              validUserStatus={(status) => this.setValidUser(status)}
            />
           )
        )}/>
        <Route path='/dashboard' render={() => 
          validUser ? (
            <Dashboard
            userData={userData}
            validUserStatus={(status) => this.setValidUser(status)}
            />
          ) : (
            <Redirect to='/' />
          )
        }/>
        <Route path='/signup' render={() => 
          <SignUp
          onUserDataUpdate={(data) => {this.userDataUpdate(data)}}
          userData={ userData }
        />  
        }/>
        <Footer />
        
      </div>
    );
  }
}

export default App;