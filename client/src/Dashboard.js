import React, { Component } from 'react';
import 'whatwg-fetch';
import './UserBox.css';
import { withRouter } from 'react-router-dom';
import UserList from './UserList';
import ActivityForm from './ActivityForm';
import ActivityList from './ActivityList'

class Dashboard extends Component {
  state = {
    activities: []
  }

  componentDidMount() {
    this.loadActivitiesFromServer();
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

  signOut = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('validUser')
    this.props.validUserStatus(false)
    this.props.history.push('/');
  }

  updateActivities = (activities) => {
    this.setState({ activities })
  }

  render() {
    const userData = (this.props.userData ? this.props.userData : this.props.location.state.userData)
    const userId = localStorage.getItem('userId')
    const { activities } = this.state

    return (
      <div>
        <ActivityForm 
          userId={userId}
          activities={activities}
          onActivityUpdate={(activities) => this.updateActivities(activities)}
        />
        <ActivityList 
          activities={activities}
        />
        <UserList
          userData={ userData } 
        />
        <button onClick={() => this.signOut()}>Sign Out</button>
      </div>
    );
  }
}

export default withRouter(Dashboard);