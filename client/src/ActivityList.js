import React, { Component } from 'react';
import ActivityDaily from './ActivityDaily';

class ActivityList extends Component {

  newWeekArray = () => {
    const { activities, weekStart } = this.props
    let activitiesArray = []
    for (let i = 0; i < 7; i++) {
      const filteredActivities = activities.filter(activity => new Date(activity.date).valueOf() === ((weekStart) + (i * 86400000)))
      activitiesArray.push(filteredActivities)
    }
    return activitiesArray
  }

  dayOfTheWeek = (index) => {
    const { weekStart } = this.props
    const dayDate = new Date((weekStart + (index * 86400000)))
    return dayDate.toUTCString()
  }

  render() {
    const weekArray = this.newWeekArray()
    
    return (
      <div>
        {weekArray.length !== 0 ? 
          (weekArray.map((day, index) => (
            <div key={index}>
            <h2>{this.dayOfTheWeek(index)}</h2>
            <ActivityDaily 
              dailyActivities = {day}
            />
            </div>
          ))) : (<p>There were no activities</p>)
        }    
      </div>
    );
  }
}

export default ActivityList;