import React, { Component } from "react";

class WeeklyRecap extends Component {
  currentActivities = (activities, weekStart) => {
    const currentWeekActivities = activities.filter(
      activity =>
        weekStart <= new Date(activity.date).valueOf() &&
        new Date(activity.date).valueOf() < weekStart + 604800000
    );
    return currentWeekActivities;
  };

  timeOutput = time => {
    const dbTime = Number(time);
    if (dbTime < 1) {
      return `${dbTime * 60} mins`;
    } else if (dbTime === 1) {
      return "1 hr";
    } else if (dbTime % 1 === 0) {
      return `${dbTime} hrs`;
    } else {
      const parsedTime = dbTime.toString().split(".");
      const hours = Number(parsedTime[0]);
      const minutes = Number(`.${parsedTime[1]}`) * 60;
      if (hours === 1) {
        return `1 hr, ${minutes} mins`;
      } else {
        return `${hours} hrs, ${minutes} mins`;
      }
    }
  };

  render() {
    const { activities, weekStart, userRole } = this.props;
    const weeklyActivityList = this.currentActivities(activities, weekStart);
    const activitiesTypeList = [
      ...new Set(weeklyActivityList.map(activity => activity.activityType))
    ];
    const weekBeginningDate = new Date(weekStart).toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "long",
      day: "numeric"
    });
    const weekEndDate = new Date(weekStart + 604800000 - 1).toLocaleDateString(
      "en-US",
      { timeZone: "UTC", month: "long", day: "numeric" }
    );

    return (
      <div className="weekly-recap">
        <h2 className="weekly-recap-heading">
          Weekly Recap{userRole === "admin" && (
            <span>
              {" "}
              - {weekBeginningDate} - {weekEndDate}
            </span>
          )}
        </h2>
        <hr />
        <table className="recap-table">
          <tbody>
            <tr className="table-header-row">
              <th className="table-data">Type</th>
              <th className="table-data">Total Duration</th>
            </tr>
            {activitiesTypeList.map(type => (
              <tr className="type-recap" key={type}>
                <td className="type-name">{type}</td>
                <td className="type-duration">
                  {this.timeOutput(
                    weeklyActivityList
                      .filter(activity => activity.activityType === type)
                      .reduce((acc, curr) => acc + curr.time, 0)
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

export default WeeklyRecap;
