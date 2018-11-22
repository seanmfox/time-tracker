import React, { Component } from "react";
import { Link } from "react-router-dom";

class SettingsNav extends Component {
  componentDidMount = () => {
    document.addEventListener("mousedown", this.handleClick, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("mousedown", this.handleClick, false);
  };

  handleClick = e => {
    if (
      !this.node.contains(e.target) &&
      !this.node.classList.contains("closed") &&
      !e.target.classList.contains("settings-nav-toggle")
    ) {
      this.node.classList.add("closed");
    }
  };

  toggleSettingsNav = e => {
    const settingsNavContainer = document.querySelector(
      ".settings-nav-container"
    );
    settingsNavContainer.classList.toggle("closed");
  };

  signOut = () => {
    this.props.onSignOut();
  };

  render() {
    const { user } = this.props;

    return (
      <div>
        <button
          className="settings-nav-toggle dropdown-button"
          onClick={this.toggleSettingsNav}
        >
          {`${user.fname} ${user.lname}`} <i className="fas fa-caret-down" />
        </button>
        <div
          className="settings-nav-container dropdown closed"
          ref={node => (this.node = node)}
        >
          <ul>
            <li>
              <Link to="/settings" className="settings-link">
                Settings
              </Link>
            </li>
            {user.userRole === "student" && (
              <li>
                <Link to="/dashboard" className="settings-link">
                  Dashboard
                </Link>
              </li>
            )}
            {user.userRole === "admin" && (
              <li>
                <Link to="/admin" className="settings-link">
                  Student Reports
                </Link>
              </li>
            )}
            <li>
              <button className="signout-button" onClick={this.signOut}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SettingsNav;
