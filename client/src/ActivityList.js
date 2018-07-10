import React, { Component } from 'react';

class ActivityList extends Component {
  render() {
    const { activities } = this.props
    
    return (
      <div>
        {activities.length !== 0 ? 
        (activities.map(activity => (
          <p key={activity._id}>{activity.activityType} {activity.time}</p>
        ))) : (<p>There were no activities</p>)
        }    
      </div>
    );
  }
}

export default ActivityList;