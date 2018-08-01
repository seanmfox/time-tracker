import React, { Component } from "react";

class ActivityForm extends Component {
  state = {
    hour: "",
    minute: "",
    activityType: "Academics",
    error: null,
    description: ""
  };

  submitForm = e => {
    e.preventDefault();
    const { activityType, hour, minute, description } = this.state;
    if (hour === 0 && minute === 0) return;
    const time = Number(hour) + Math.round((Number(minute) / 60) * 100) / 100;
    const date = document.querySelector(".date-input").value;
    if (!activityType || !time || !date || !description) return;
    this.submitNewActivity(
      activityType,
      time,
      description,
      new Date(date).toISOString()
    );
  };

  submitNewActivity = (activityType, time, description, date) => {
    const { userId } = this.props;
    fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activityType, time, userId, date, description })
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          this.setState({ error: res.error.message || res.error });
        } else {
          this.setState({
            activityType: "Class",
            hour: "",
            minute: "",
            error: null,
            description: ""
          });
          this.props.onActivityUpdate();
        }
      });
  };

  onChangeText = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  onChangeTime = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  handleSelectChange = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  render() {
    const { hour, minute, activityType, description } = this.state;

    return (
      <div className="activity-form-container closed">
        <form onSubmit={this.submitForm} className="activity-form">
          <label>
            Description
            <input
              value={description}
              type="text"
              name="description"
              onChange={this.onChangeText}
              className="description-input"
              maxLength="14"
              required
            />
          </label>
          <label>
            Activity Type
            <select
              className="type-input"
              name="activityType"
              value={activityType}
              onChange={this.handleSelectChange}
              required
            >
              <option value="Academics">Academics</option>
              <option value="Athletics">Athletics</option>
              <option value="Studying">Studying</option>
              <option value="Work">Work</option>
              <option value="Socializing">Socializing</option>
              <option value="Other">Other</option>
            </select>
          </label>
          <label>
            Activity Duration
            <input
              value={hour}
              type="number"
              name="hour"
              onChange={this.onChangeTime}
              className="duration-input"
              placeholder="hours"
            />
            <input
              value={minute}
              type="number"
              name="minute"
              onChange={this.onChangeTime}
              className="duration-input"
              placeholder="minutes"
            />
          </label>
          <label>
            Date
            <input
              type="date"
              name="date-input"
              className="date-input"
              required
            />
          </label>
          <button type="submit" className="activity-submit">
            Submit Activity
          </button>
        </form>
      </div>
    );
  }
}

export default ActivityForm;
