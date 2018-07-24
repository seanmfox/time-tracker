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
    const { dailyActivities, userRole } = this.props

    return (
      <div className="day-body">
        {dailyActivities.map(activity => (
          <div key={activity._id} className="activity">
            <p>{activity.description} {activity.activityType} {activity.time}</p>
            {!userRole && <button onClick={() => this.deleteActivity(activity._id)}>Delete</button>}
          </div>
        ))}
      </div>
    );
  }
}

export default ActivityDaily;