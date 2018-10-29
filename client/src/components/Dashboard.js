import React, { Component } from "react";
import "whatwg-fetch";
import { withRouter } from "react-router-dom";
import ActivityForm from "./ActivityForm";
import WeekContent from "./WeekContent";
import { loadUserActivities } from "../lib/DBAPI";
import SettingsNav from "./SettingsNav";

class Dashboard extends Component {
  state = {
    activities: []
  };

  componentDidMount() {
    this.loadActivitiesFromServer();
  }

  async loadActivitiesFromServer() {
    const { userId } = this.props.user;
    let res = await loadUserActivities(userId);
    if (!res.success) this.setState({ error: res.error });
    else this.setState({ activities: res.activities });
  }

  signOut = () => {
    localStorage.removeItem("JWT");
    this.props.validUser("");
    this.props.history.push("/");
  };

  changeOfWeek = shift => {
    this.props.onChangeWeek(shift);
  };

  updateActivities = () => {
    this.loadActivitiesFromServer();
  };

  render() {
    const { activities } = this.state;
    const { weekStart, user } = this.props;

    return (
      <div className="dashboard">
        <nav className="activity-nav">
          <ul>
            <li>
              <ActivityForm
                userId={user.userId}
                activities={activities}
                onActivityUpdate={this.updateActivities}
              />
            </li>
            <li>
              <SettingsNav 
                onSignOut={this.signOut} 
                user={user}
              />
            </li>
          </ul>
        </nav>
        <main className="dashboard-content">
          <WeekContent
            onWeekChange={shift => this.changeOfWeek(shift)}
            activities={activities}
            weekStart={weekStart}
            userId={user.userId}
            onActivityUpdate={this.updateActivities}
          />
        </main>
      </div>
    );
  }
}

export default withRouter(Dashboard);
