import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserList from "./UserList";
import { userData } from "../lib/DBAPI";
import SettingsNav from "./SettingsNav";

class Admin extends Component {
  state = {
    userData: [],
    error: null
  };

  componentDidMount() {
    this.loadUserDataFromServer();
  }

  async loadUserDataFromServer() {
    let res = await userData();
    if (!res.success) this.setState({ error: res.error });
    else this.setState({ userData: res.userData });
  }

  signOut = () => {
    localStorage.removeItem("JWT");
    this.props.validUser("");
    this.props.history.push("/");
  };

  changeOfWeek = shift => {
    this.props.onWeekChange(shift);
  };

  render() {
    const { userData } = this.state;
    const { weekStart, userRole, user } = this.props;
    return (
      <div className="admin">
        <nav className="activity-nav">
          <ul>
            <li>
              <SettingsNav user={user} onSignOut={this.signOut} />
            </li>
          </ul>
        </nav>
        <main className="admin-content">
        <UserList
          userData={userData}
          weekStart={weekStart}
          userRole={userRole}
          onWeekChange={shift => this.changeOfWeek(shift)}
        />
        </main>
      </div>
    );
  }
}

export default withRouter(Admin);
