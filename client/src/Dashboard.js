import React, { Component } from 'react';
import 'whatwg-fetch';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList'

class Dashboard extends Component {
  state = {
    activities: [],
    weekStart: ''
  }

  componentDidMount() {
    this.loadActivitiesFromServer();
    this.setCurrentWeek();
  }

  loadActivitiesFromServer = () => {
    const userId = localStorage.getItem('userId')
    fetch(`/api/activities/${userId}`)
    .then(data => data.json())
    .then((res) => {
      if (!res.success) this.setState({ error: res.error });
      else this.setState({ activities: res.activities });
    });
  }

  setCurrentWeek = () => {
    const currentDate = new Date(Date.now())
    const weekBeginningDate = currentDate.getUTCDate() - currentDate.getUTCDay()
    const startOfDay = new Date(currentDate.setUTCDate(weekBeginningDate))
    startOfDay.setUTCHours(0, 0, 0, 0)
    this.setState({ weekStart: startOfDay.valueOf()})
  }

  signOut = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('validUser')
    this.props.validUserStatus(false)
    this.props.history.push('/');
  }

  changeWeek = (shift) => {
    this.setState(prevState => (
      { weekStart: (prevState.weekStart + shift) }
    ))
  }

  updateActivities = () => {
    this.loadActivitiesFromServer()
  }

  toggleActivityForm = () => {
    const activityFormContainer = document.querySelector('.activity-form-container')
    activityFormContainer.classList.toggle('closed')
  }

  render() {
    const userData = (this.props.userData ? this.props.userData : this.props.location.state.userData)
    const userId = localStorage.getItem('userId')
    const { activities, weekStart } = this.state

    return (
      <div className="dashboard">
        <nav className="activity-nav">
          <button className="activity-form-toggle" onClick={this.toggleActivityForm}>Add Activity <i className="fas fa-caret-down"></i></button>
          <ActivityForm 
            userId={userId}
            activities={activities}
            onActivityUpdate={() => this.updateActivities()}
          />
          <button onClick={() => this.signOut()}>Sign Out</button>
        </nav>
        <div className="week-change-buttons">
          <button onClick={() => this.changeWeek(-604800000)}>Previous Week</button>
          <button onClick={() => this.changeWeek(604800000)}>Next Week</button>
        </div>
        <ActivityList
          userId={userId} 
          activities={activities}
          weekStart={weekStart}
          onActivityUpdate={() => this.updateActivities()}
        />
        <UserList
          userData={ userData } 
        />
      </div>
    );
  }
}

export default withRouter(Dashboard);