import React, { Component } from "react";
import { updateUserPassword } from "../lib/DBAPI";
import AlertMessage from "./AlertMessage";

class StudentProfile extends Component {
  state = {
    password: "",
    error: [],
    message: ""
  };

  toggleProfileForm = () => {
    const studentProfileContainer = document.querySelector(
      ".student-profile-container"
    );
    studentProfileContainer.classList.toggle("closed");
  };

  onChangeText = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  submitUser = e => {
    e.preventDefault();
    this.onPasswordReset();
  };

  async onPasswordReset() {
    const { password } = this.state;
    const { selectedUserData } = this.props;
    if (password.length === 0) return;
    let res = await updateUserPassword(selectedUserData._id, password);
    if (!res.success) {
      this.setState({ error: res.error.message || res.error });
    } else {
      this.setState({
        password: "",
        error: [],
        message: "The user password has been reset"
      });
      window.setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
    }
  }

  render() {
    const { password, message } = this.state;
    const { selectedUserData } = this.props;

    return (
      <div>
        <button
          className="profile-form-toggle display-button dropdown-button"
          onClick={this.toggleProfileForm}
        >
          Student Profile <i className="fas fa-caret-down" />
        </button>
        <div className="student-profile-container display closed">
          {message.length > 0 && <AlertMessage message={message} />}
          <ul>
            <li>First Name: {selectedUserData.fname}</li>
            <li>Last Name: {selectedUserData.lname}</li>
            <li>Email: {selectedUserData.email}</li>
            <li>
              <form className="user-profile-form" onSubmit={this.submitUser}>
                <input
                  type="text"
                  name="password"
                  placeholder="New Password"
                  value={password}
                  onChange={this.onChangeText}
                  aria-label="new password"
                  required
                />
                <button type="submit">Update Password</button>
              </form>
            </li>
          </ul>
        </div>
        <hr />
      </div>
    );
  }
}

export default StudentProfile;
