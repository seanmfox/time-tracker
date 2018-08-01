import React, { Component } from "react";
import UserForm from "./UserForm";
import { withRouter } from "react-router-dom";

class SignUp extends Component {
  state = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    verifyPassword: "",
    error: [],
    userList: []
  };

  componentDidMount() {
    this.loadUsersFromServer();
  }

  loadUsersFromServer = () => {
    fetch("/api/users/")
      .then(data => data.json())
      .then(res => {
        if (!res.success) this.setState({ error: res.error });
        else this.setState({ userList: res.userList });
      });
  };

  onChangeText = e => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  };

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
    if (error.length > 0) {
      this.setState({ error: [] });
    }
    let errorMessages = [];
    if (!fname || !lname || !email || !password || !verifyPassword) return;
    if (userList.map(user => user.email).includes(email)) {
      errorMessages.push("That email address is already taken.");
    }
    if (password !== verifyPassword) {
      errorMessages.push("Your passwords do not match.");
    }
    if (errorMessages.length > 0) {
      this.setState({ error: errorMessages });
    } else {
      this.submitNewUser();
    }
  };

  submitNewUser = () => {
    const { fname, lname, email, password } = this.state;
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fname, lname, email, password })
    })
      .then(res => res.json())
      .then(res => {
        if (!res.success) {
          this.setState({ error: res.error.message || res.error });
        } else {
          this.setState({
            fname: "",
            lname: "",
            email: "",
            password: "",
            verifyPassword: "",
            error: []
          });
          this.props.history.push("/");
        }
      });
  };

  render() {
    const { fname, lname, email, password, verifyPassword, error } = this.state;
    const { userRole } = this.props;
    if (error.length > 0) {
      const messages = document.querySelector(".messages");
      messages.classList.add("error-alert");
      messages.innerHTML = error
        .map(err => `<p class="error-message">${err}</p>`)
        .join("");
    }

    return (
      <div className="signup-page-container">
        <h2 className="signup-text">Join Time Tracker Today</h2>
        <div className="messages" />
        {!userRole && (
          <UserForm
            fname={fname}
            lname={lname}
            email={email}
            password={password}
            verifyPassword={verifyPassword}
            handleChangeText={this.onChangeText}
            submitUser={this.submitUser}
          />
        )}
      </div>
    );
  }
}

export default withRouter(SignUp);
