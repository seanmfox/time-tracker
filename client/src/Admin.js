import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import UserList from "./UserList";

class Admin extends Component {
  state = {
    userData: [],
    error: null
  };

  componentDidMount() {
    this.loadUserDataFromServer();
  }

  loadUserDataFromServer = () => {
    fetch("/api/userdata/")
      .then(data => data.json())
      .then(res => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ userData: res.userData });
      });
  };

  signOut = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    this.props.validUserRole("");
    this.props.history.push("/");
  };

  changeOfWeek = shift => {
    this.props.onWeekChange(shift);
  };

  render() {
    const { userData } = this.state;
    const { weekStart, userRole } = this.props;
    return (
      <div className="admin">
        <button onClick={() => this.signOut()}>Sign Out</button>
        <UserList
          userData={userData}
          weekStart={weekStart}
          userRole={userRole}
          onWeekChange={shift => this.changeOfWeek(shift)}
        />
      </div>
    );
  }
}

export default withRouter(Admin);
