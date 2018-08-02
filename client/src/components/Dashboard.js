import React, { Component } from "react";
import "whatwg-fetch";
import { withRouter } from "react-router-dom";
import ActivityForm from "./ActivityForm";
import WeekContent from "./WeekContent";
import { loadUserActivities } from "../lib/DBAPI";

class Dashboard extends Component {
  state = {
    activities: []
  };

  componentDidMount() {
    this.loadActivitiesFromServer();
  }

  loadActivitiesFromServer = () => {
    const userId = localStorage.getItem("userId");
    loadUserActivities(userId)
      .then(res => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ activities: res.activities });
      });
  };

  signOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    this.props.validUserRole("");
    this.props.history.push("/");
  };

  changeOfWeek = shift => {
    this.props.onChangeWeek(shift);
  };

  updateActivities = () => {
    this.loadActivitiesFromServer();
  };

  toggleActivityForm = () => {
    const activityFormContainer = document.querySelector(
      ".activity-form-container"
    );
    activityFormContainer.classList.toggle("closed");
  };

  render() {
    const userId = localStorage.getItem("userId");
    const { activities } = this.state;
    const { weekStart } = this.props;

    return (
      <div className="dashboard">
        <nav className="activity-nav">
          <button
            className="activity-form-toggle"
            onClick={this.toggleActivityForm}
          >
            Add Activity <i className="fas fa-caret-down" />
          </button>
          <ActivityForm
            userId={userId}
            activities={activities}
            onActivityUpdate={this.updateActivities}
          />
          <button onClick={this.signOut}>Sign Out</button>
        </nav>
        <main className="dashboard-content">
          <WeekContent
            onWeekChange={shift => this.changeOfWeek(shift)}
            activities={activities}
            weekStart={weekStart}
            userId={userId}
            onActivityUpdate={this.updateActivities}
          />
        </main>
      </div>
    );
  }
}

export default withRouter(Dashboard);
