import React, { Component } from 'react';

class ActivityForm extends Component {
  state = {
    time: 0,
    activityType: 'class',
    error: ''
  }

  submitForm = (e) => {
    e.preventDefault()
    const { activityType, time } = this.state
    if (!activityType || !time) return;
    this.submitNewActivity(activityType, time)
  }

  submitNewActivity = (activityType, time) => {
    const { userId } = this.props
    const activities = [...this.props.activities, { activityType, time, _id: Date.now().toString() }];
    this.props.onActivityUpdate(activities);
    fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType, time, userId }),
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

  handleSelectChange = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);  
  }

  render() {
    const {time, activityType} = this.state

    return (
      <div>
        <form onSubmit={(e) => this.submitForm(e)}>
          <select className='time-input' name='activityType' value={activityType} onChange={this.handleSelectChange}>
            <option value='class'>Class</option>
            <option value='athletics'>Athletics</option>
            <option value='studying'>Studying</option>
            <option value='sleeping'>Sleeping</option>
            <option value='socializing'>socializing</option>
          </select>
          <input value={time} type='number' name='time' onChange={this.onChangeTime}/>
          <button type='submit'>Submit Activity</button>
        </form>
      </div>
    );
  }
}

export default ActivityForm;