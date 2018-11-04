import React, { Component } from "react";

class AlertMessage extends Component {
  render() {
    const { message } = this.props;
    return (
      <div className="alert-message">
        <p>{message}</p>
      </div>
    );
  }
}

export default AlertMessage;
