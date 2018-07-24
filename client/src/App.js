import React, { Component } from 'react';
import Dashboard from './Dashboard';
import SignUp from './SignUp';
import 'whatwg-fetch';
import { Route, Redirect } from 'react-router-dom'
import HomePage from './HomePage';
import './App.css'
import Header from './Header'
import Footer from './Footer'
import Admin from './Admin';

class App extends Component {
  state = {
    userRole: '',
    error: '',
    weekStart: ''
  }

  componentDidMount() {
    this.localStorageUpdate();
    this.setCurrentWeek();
  }

  localStorageUpdate = () => {
    if (localStorage.getItem('userRole')) {
      this.setState({ userRole: localStorage.getItem('userRole') })
    }
  }

  setCurrentWeek = () => {
    const currentDate = new Date(Date.now())
    const weekBeginningDate = currentDate.getUTCDate() - currentDate.getUTCDay()
    const startOfDay = new Date(currentDate.setUTCDate(weekBeginningDate))
    startOfDay.setUTCHours(0, 0, 0, 0)
    this.setState({ weekStart: startOfDay.valueOf()})
  }

  changeWeek = (shift) => {
    this.setState(prevState => (
      { weekStart: (prevState.weekStart + shift) }
    ))
  }

  setUserRole = (role) => {
    this.setState({ userRole: role })
  }
  
  render() {
    const { userRole, weekStart } = this.state

    return (
      <div className="app">
        <Header />
        <Route exact path="/" render={() => (
          userRole === 'admin' ? (
            <Redirect to='/admin' />
          ) : ( userRole === 'student' ? (
                <Redirect to='/dashboard' />
          ) : (
            <HomePage
              validUserRole={(role) => this.setUserRole(role)}
            />
          ))
        )}/>
        <Route path='/admin' render={() => 
          userRole === 'admin' ? (
            <Admin
              validUserRole={(role) => this.setUserRole(role)}
              weekStart={weekStart}
              userRole={userRole}
            />
          ) : (
            <Redirect to='/' />
          )
        }/>
        <Route path='/dashboard' render={() => 
          userRole === 'student' ? (
            <Dashboard
            validUserRole={(role) => this.setUserRole(role)}
            onChangeWeek={(timeChange) => this.changeWeek(timeChange)}
            weekStart={weekStart}
            />
          ) : (
            <Redirect to='/' />
          )
        }/>
        <Route path='/signup' render={() => 
          <SignUp
            userRole={userRole}
          />  
        }/>
        <Footer />
        
      </div>
    );
  }
}

export default App;