import React, { Component } from "react";
import { userUpdate, loadUserList, userAuth } from "../lib/DBAPI";
import SettingsNav from "./SettingsNav";
import { withRouter } from "react-router-dom";

class Settings extends Component {
  state = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    verifyPassword: "",
    error: [],
    userList: [],
    user: ""
  };

  componentDidMount() {
    this.loadUsersFromServer();
    this.localStorageUpdate();
  }

  localStorageUpdate = () => {
    if (localStorage.getItem("JWT") && this.state.user === "") {
      this.authenticateUser();
    }
  };

  async authenticateUser() {
    let res = await userAuth();
    if (!res.success) this.setState({ error: res.error });
    else
      this.setState({
        user: res,
        fname: res.fname,
        lname: res.lname,
        email: res.email
      });
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
      error,
      user
    } = this.state;
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
    const { fname, lname, email, password, user } = this.state;
    const newPassword = password.length > 0 ? password : undefined;
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
        user: res.user
      });
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
      user,
      error
    } = this.state;
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
      <div>
        <nav className="activity-nav">
          <ul>
            <li>
              <SettingsNav user={user} onSignOut={this.signOut} />
            </li>
          </ul>
        </nav>
        <div className="settings-page-container">
        <div className="messages" />
        <form className="user-update-form" onSubmit={this.submitUser}>
          <input
            type="text"
            name="fname"
            placeholder="First Name"
            value={fname}
            onChange={this.onChangeText}
            required
          />
          <input
            type="text"
            name="lname"
            placeholder="Last Name"
            value={lname}
            onChange={this.onChangeText}
            required
          />
          <input
            className="user-signup-email"
            type="email"
            name="email"
            placeholder="Email Address"
            value={email}
            onChange={this.onChangeText}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.onChangeText}
          />
          <input
            type="password"
            name="verifyPassword"
            placeholder="Verify password"
            value={verifyPassword}
            onChange={this.onChangeText}
          />
          <button type="submit">Save Changes</button>
        </form>
        </div>
      </div>
    );
  }
}

export default withRouter(Settings);
