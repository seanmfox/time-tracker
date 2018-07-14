import React, { Component } from 'react';

class ActivityDaily extends Component {

  state = {
    error: null
  }

  deleteActivity = (activityId) => {
    const {userId} = this.props
    fetch(`/api/activities/${activityId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.props.onActivityDelete();
      }
    });
  }

  render() {
    const { dailyActivities } = this.props

    return (
      <div>
        {dailyActivities.map(activity => (
          <div key={activity._id}>
            <p>{activity.activityType} {activity.time} {activity.date}</p>
            <button onClick={() => this.deleteActivity(activity._id)}>Delete</button>
          </div>
        ))}
      </div>
    );
  }
}

export default ActivityDaily;