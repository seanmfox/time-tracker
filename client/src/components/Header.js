import React, { Component } from "react";
import Settings from "./Settings"

class Header extends Component {
  render() {
    return (
      <header>
        <h1>Time Tracker</h1>
        <Settings />
      </header>
    );
  }
}

export default Header;
