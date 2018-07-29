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

  timeOutput = (time) => {
    const dbTime = Number(time)
    if (dbTime < 1) {
      return `${(dbTime * 60)} mins`
    } else if (dbTime === 1) {
      return '1 hr'
    } else if (dbTime % 1 === 0) {
      return `${dbTime} hrs`
    } else {
      const parsedTime = dbTime.toString().split('.')
      const hours = Number(parsedTime[0])
      const minutes = Number(`.${parsedTime[1]}`) * 60
      if (hours === 1) {
        return `1 hr, ${minutes} mins`
      } else {
        return `${hours} hrs, ${minutes} mins`
      }
    }
  }

  render() {
    const { dailyActivities, userRole } = this.props

    return (
      <div className="day-body">
      <table className="day-table">
        <tbody>
        {dailyActivities.length > 0 &&
        <tr className="table-header-row">
          <th className="table-data">Description</th>
          <th className="table-data">Type</th>
          <th className="table-data">Duration</th>
        </tr>}
        {dailyActivities.map(activity => (
          <tr key={activity._id} className="activity">
            <td>{activity.description}</td>
            <td>{activity.activityType}</td> 
            <td>{this.timeOutput(activity.time)}</td> 
            <td>{!userRole && <button onClick={() => this.deleteActivity(activity._id)} className="del-btn"><i className="fas fa-trash-alt"></i></button>}</td>
          </tr>
        ))}
        </tbody>
        </table>
      </div>
    );
  }
}

export default ActivityDaily;