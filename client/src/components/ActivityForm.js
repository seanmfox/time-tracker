import React, { Component } from "react";
import { createNewActivity } from "../lib/DBAPI";

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

  async submitNewActivity(activityType, time, description, date) {
    const { userId } = this.props;
    let res = await createNewActivity(
      activityType,
      time,
      userId,
      date,
      description
    );
    if (!res.success) {
      this.setState({ error: res.error.message || res.error });
    } else {
      this.setState({
        activityType: "Academics",
        hour: "",
        minute: "",
        error: null,
        description: ""
      });
      this.props.onActivityUpdate();
    }
  }

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

  toggleActivityForm = () => {
    const activityFormContainer = document.querySelector(
      ".activity-form-container"
    );
    activityFormContainer.classList.toggle("closed");
  };

  render() {
    const { hour, minute, activityType, description } = this.state;

    return (
      <React.Fragment>
        <button
          className="activity-form-toggle dropdown-button"
          onClick={this.toggleActivityForm}
        >
          Add Activity <i className="fas fa-caret-down" />
        </button>
        <div className="activity-form-container dropdown closed">
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
              <label id="activity-duration-label">Activity Duration</label>
              <input
                value={hour}
                type="number"
                name="hour"
                onChange={this.onChangeTime}
                className="duration-input"
                placeholder="hours"
                aria-label="hours"
              />
              <input
                value={minute}
                type="number"
                name="minute"
                onChange={this.onChangeTime}
                className="duration-input"
                placeholder="minutes"
                aria-label="minutes"
              />
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
      </React.Fragment>
    );
  }
}

export default ActivityForm;
