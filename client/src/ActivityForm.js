import React, { Component } from 'react';

class ActivityForm extends Component {
  state = {
    time: '',
    activityType: 'Academics',
    error: null,
    description: ''
  }

  submitForm = (e) => {
    e.preventDefault()
    const { activityType, time, description } = this.state
    const date = document.querySelector('.date-input').value
    if (!activityType || !time || !date || !description) return;
    this.submitNewActivity(activityType, time, description, new Date(date).toISOString())
  }

  submitNewActivity = (activityType, time, description, date) => {
    const { userId } = this.props
    fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activityType, time, userId, date, description }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) {this.setState({ error: res.error.message || res.error });}
      else {
        this.setState({ activityType: 'Class', time: 0, error: null, description: '' });
        this.props.onActivityUpdate();
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
    const { time, activityType, description } = this.state

    return (
      <div className="activity-form-container closed">
        <form onSubmit={this.submitForm} className="activity-form">
          <label>Description
            <input value={description} type='text' name='description' onChange={this.onChangeText} className="description-input" required/>
          </label>
          <label>Activity Type
            <select className='type-input' name='activityType' value={activityType} onChange={this.handleSelectChange} required>
              <option value='Academics'>Academics</option>
              <option value='Athletics'>Athletics</option>
              <option value='Studying'>Studying</option>
              <option value='Work'>Work</option>
              <option value='Socializing'>Socializing</option>
              <option value='Other'>Other</option>
            </select>
          </label>
          <label>Activity Duration
            <input value={time} type='number' name='time' onChange={this.onChangeTime} className="duration-input" required/>
          </label>
          <label>Date
            <input type='date' name='date-input' className='date-input' required/>
          </label>
          <button type='submit' className="activity-submit">Submit Activity</button>
        </form>
      </div>
    );
  }
}

export default ActivityForm;