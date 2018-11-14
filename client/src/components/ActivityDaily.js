import React, { Component } from "react";
import { timeOutput } from "../lib/timeOutput"
import { dbRemoveActivity } from "../lib/DBAPI";

class ActivityDaily extends Component {
  state = {
    error: null
  };

  async deleteActivity(activityId) {
    const { userId } = this.props;
    let res = await dbRemoveActivity(userId, activityId)
    if (!res.success) {
      this.setState({ error: res.error.message || res.error });
    } else {
      this.props.onActivityDelete();
    }
  };

  render() {
    const { dailyActivities, userRole } = this.props;

    return (
      <div className="day-body">
        <table className="day-table">
          <tbody>
            {dailyActivities.length > 0 && (
              <tr className="table-header-row">
                <th className="table-data">Description</th>
                <th className="table-data">Type</th>
                <th className="table-data">Duration</th>
              </tr>
            )}
            {dailyActivities.map(activity => (
              <tr key={activity._id} className="activity">
                <td>{activity.description}</td>
                <td>{activity.activityType}</td>
                <td>{timeOutput(activity.time)}</td>
                <td>
                  {!userRole && (
                    <button aria-label="delete activity"
                      onClick={() => this.deleteActivity(activity._id)}
                      className="del-btn"
                    >
                      <i className="fas fa-trash-alt" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ActivityDaily;
