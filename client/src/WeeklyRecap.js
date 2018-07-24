import React, { Component } from 'react';

class WeeklyRecap extends Component {
  
  currentActivities = (activities, weekStart) => {
    const currentWeekActivities = activities.filter(activity => weekStart <= new Date(activity.date).valueOf() && new Date(activity.date).valueOf() < (weekStart + 604800000)  )
    return currentWeekActivities
  }

  render() {
    const { activities, weekStart, userRole } = this.props
    const weeklyActivityList = this.currentActivities(activities, weekStart)
    const activitiesTypeList = [...new Set(weeklyActivityList.map(activity => activity.activityType))]
    const weekBeginningDate = new Date(weekStart).toLocaleDateString('en-US', {timeZone: 'UTC', month: 'long', day: 'numeric' })
    const weekEndDate = new Date(weekStart + 604800000 - 1).toLocaleDateString('en-US', {timeZone: 'UTC', month: 'long', day: 'numeric' })
    
    return (
      <div className="weekly-recap">
        <h2 className="weekly-recap-heading">Weekly Recap{userRole === 'admin' && <span> - {weekBeginningDate} - {weekEndDate}</span>}</h2>
        <hr/>
        {activitiesTypeList.map(type => (
          <div className="type-recap" key={type}>
            <span className="type-name">{type} - </span><span className="type-duration">{weeklyActivityList.filter(activity => activity.activityType === type).reduce((acc, curr) => acc + curr.time, 0)} hours</span>
          </div>
        ))}
      </div>
    );
  }
}

export default WeeklyRecap;