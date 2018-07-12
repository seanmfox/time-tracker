import React, { Component } from 'react';

class ActivityDaily extends Component {
  
  render() {
    const { dailyActivities } = this.props

    return (
      <div>

        {dailyActivities.map(activity => (
          <p key={activity._id}>{activity.activityType} {activity.time} {activity.date}</p>
        ))}
      </div>
    );
  }
}

export default ActivityDaily;