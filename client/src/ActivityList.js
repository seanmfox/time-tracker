import React, { Component } from 'react';
import ActivityDaily from './ActivityDaily';

class ActivityList extends Component {
  state = {
    weekStart: ''
  }

  componentDidMount() {
    this.setCurrentWeek()
  }

  setCurrentWeek = () => {
    const currentDate = new Date(Date.now())
    const weekBeginningDate = currentDate.getUTCDate() - currentDate.getUTCDay()
    const startOfDay = new Date(currentDate.setUTCDate(weekBeginningDate))
    startOfDay.setUTCHours(0, 0, 0, 0)
    this.setState({ weekStart: startOfDay.toISOString()})
  }

  newWeekArray = () => {
    let { weekStart } = this.state
    const { activities } = this.props
    let activitiesArray = []
    for (let i = 0; i < 7; i++) {
      const filteredActivities = activities.filter(activity => new Date(activity.date).valueOf() === (new Date(weekStart).valueOf() + (i * 86400000)))
      activitiesArray.push(filteredActivities)
    }
    return activitiesArray
  }

  dayOfTheWeek = (index) => {
    const { weekStart } = this.state
    return (new Date(new Date(weekStart).valueOf() + (index * 86400000)).toISOString())
  }

  render() {
    const { activities } = this.props
    const weekArray = this.newWeekArray()
    console.log(weekArray)
    // console.log(activities)
    console.log(this.state.weekStart)
    
    return (
      <div>
        {activities.length !== 0 ? 
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