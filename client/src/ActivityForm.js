import React, { Component } from 'react';

class ActivityForm extends Component {
  state = {
    time: '',
    activityType: 'class',
    error: null,
  }

  submitForm = (e) => {
    e.preventDefault()
    const { activityType, time } = this.state
    const date = document.querySelector('.date').value
    if (!activityType || !time || !date) return;
    this.submitNewActivity(activityType, time, new Date(date).toISOString())
  }

  submitNewActivity = (activityType, time, date) => {
    console.log(date)
    const { userId } = this.props
    const activities = [...this.props.activities, { activityType, time, date, _id: Date.now().toString() }];
    this.props.onActivityUpdate(activities);
    fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType, time, userId, date }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.setState({ activityType: 'Class', time: 0, error: null });
      }
    });
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }
  
  onChangeTime = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  onChangeDate = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  handleSelectChange = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);  
  }

  render() {
    const { time, activityType } = this.state

    return (
      <div>
        <form onSubmit={this.submitForm}>
          <select className='time-input' name='activityType' value={activityType} onChange={this.handleSelectChange}>
            <option value='class'>Class</option>
            <option value='athletics'>Athletics</option>
            <option value='studying'>Studying</option>
            <option value='sleeping'>Sleeping</option>
            <option value='socializing'>Socializing</option>
          </select>
          <input value={time} type='number' name='time' onChange={this.onChangeTime}/>
          <input type='date' name='date' className='date'/>
          <button type='submit'>Submit Activity</button>
        </form>
      </div>
    );
  }
}

export default ActivityForm;