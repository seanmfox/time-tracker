import React, { Component } from "react";
import { userUpdate, loadUserList } from "../lib/DBAPI";
import SettingsNav from "./SettingsNav";
import { withRouter } from "react-router-dom";
import AlertMessage from "./AlertMessage";

class Settings extends Component {
  state = {
    fname: this.props.user.fname,
    lname: this.props.user.lname,
    email: this.props.user.email,
    password: "",
    verifyPassword: "",
    error: [],
    userList: [],
    message: ""
  };

  componentDidMount() {
    this.loadUsersFromServer();
  }

  async loadUsersFromServer() {
    let res = await loadUserList();
    if (!res.success) this.setState({ error: res.error });
    else this.setState({ userList: res.userList });
  }

  submitUser = e => {
    e.preventDefault();
    const {
      fname,
      lname,
      email,
      password,
      verifyPassword,
      userList,
      error
    } = this.state;
    const { user } = this.props;
    if (error.length > 0) {
      this.setState({ error: [] });
    }
    let errorMessages = [];
    if (!fname || !lname || !email) return;
    if (
      userList
        .filter(u => u.email !== user.email)
        .map(u => u.email)
        .includes(email)
    ) {
      errorMessages.push("That email address is already taken.");
    }
    if (password.length > 0 && password !== verifyPassword) {
      errorMessages.push("Your passwords do not match.");
    }
    if (errorMessages.length > 0) {
      this.setState({ error: errorMessages });
    } else {
      this.updateUser();
    }
  };

  async updateUser() {
    const { fname, lname, email, password } = this.state;
    const { user } = this.props;
    const newPassword = password.length > 0 ? password : "noPasswordEntered";
    let res = await userUpdate(user.userId, fname, lname, email, newPassword);
    if (!res.user.success) {
      this.setState({ error: res.error.message || res.error });
    } else {
      localStorage.JWT = res.token;
      this.props.validUser(res.user);
      this.setState({
        password: "",
        verifyPassword: "",
        error: [],
        message: "Your profile information has been updated."
      });
      window.setTimeout(() => {
        this.setState({ message: "" });
      }, 5000);
    }
  }

  onChangeText = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

  signOut = () => {
    localStorage.removeItem("JWT");
    this.props.validUser("");
    this.props.history.push("/");
  };

  render() {
    const {
      fname,
      lname,
      email,
      password,
      verifyPassword,
      error,
      message
    } = this.state;
    const { user } = this.props;
    const messages = document.querySelector(".messages");
    if (error.length > 0) {
      messages.classList.add("error-alert");
      messages.innerHTML = error
        .map(err => `<p class="error-message">${err}</p>`)
        .join("");
    } else if (
      error.length === 0 &&
      document.querySelectorAll(".error-message").length > 0
    ) {
      messages.classList.remove("error-alert");
      messages.innerHTML = "";
    }

    return (
      <div className="settings">
        <nav className="activity-nav">
          <ul>
            <li>
              <SettingsNav user={user} onSignOut={this.signOut} />
            </li>
          </ul>
        </nav>
        <div className="settings-page-container">
          <h1>User Settings</h1>
          <div className="messages" />
          {message.length > 0 && <AlertMessage message={message} />}
          <form className="user-update-form" onSubmit={this.submitUser}>
            <label>
              First Name
              <input
                type="text"
                name="fname"
                placeholder="First Name"
                value={fname}
                onChange={this.onChangeText}
                required
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                name="lname"
                placeholder="Last Name"
                value={lname}
                onChange={this.onChangeText}
                required
              />
            </label>
            <label>
              Email
              <input
                className="user-signup-email"
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={this.onChangeText}
                required
              />
            </label>
            <hr />
            <sup>Password fields only required if changing password:</sup>
            <br />
            <label>
              New Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={this.onChangeText}
              />
            </label>
            <label>
              Verify New Password
              <input
                type="password"
                name="verifyPassword"
                placeholder="Verify password"
                value={verifyPassword}
                onChange={this.onChangeText}
              />
            </label>
            <button type="submit">Update Settings</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Settings);
