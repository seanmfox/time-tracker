import React, { Component } from "react";
import { Link } from "react-router-dom";

class SettingsNav extends Component {
  toggleActivityForm = () => {
    const activityFormContainer = document.querySelector(
      ".settings-nav-container"
    );
    activityFormContainer.classList.toggle("closed");
  };

  signOut = () => {
    this.props.onSignOut();
  };

  render() {
    const {user} = this.props
    return (
      <div>
        <button className="settings-nav-toggle dropdown-button" onClick={this.toggleActivityForm}>
          {`${user.fname} ${user.lname}`} <i className="fas fa-caret-down" />
        </button>
        <div className="settings-nav-container dropdown closed">
          <ul>
            <li>
              <Link to="/settings" className="settings-link">
                Settings
              </Link>
            </li>
            <li>
              <button className="signout-button" onClick={this.signOut}>Sign Out</button>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default SettingsNav;
