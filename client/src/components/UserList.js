import React, { Component } from "react";
import WeekContent from "./WeekContent";
import StudentProfile from "./StudentProfile";

class UserList extends Component {
  state = {
    selectedUser: ""
  };

  handleSelectChange = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  changeOfWeek = shift => {
    this.props.onWeekChange(shift);
  };

  render() {
    const { selectedUser } = this.state;
    const { userData, weekStart, userRole } = this.props;
    const selectedUserData = userData.find(u => u._id === selectedUser)

    return (
      <div>
        {userData.length !== 0 ? (
          <>
          <h2>Select a student:</h2>
          <select
            value={selectedUser}
            name="selectedUser"
            onChange={this.handleSelectChange}
            className="user-select"
          >
            <option />
            {userData.map(user => (
              <option key={user._id} value={user._id}>
                {user.fname} {user.lname}
              </option>
            ))}
          </select>
          </>
        ) : (
          <p>There were no users</p>
        )}
        {selectedUser !== "" && (
          <React.Fragment>
            <StudentProfile selectedUserData={selectedUserData}/>
            <WeekContent
              userRole={userRole}
              onWeekChange={shift => this.changeOfWeek(shift)}
              weekStart={weekStart}
              activities={
                selectedUserData["activities"]
              }
              userId={selectedUser}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default UserList;
