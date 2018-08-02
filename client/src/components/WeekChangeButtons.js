import React, { Component } from "react";

class WeekChangeButtons extends Component {
  changeOfWeek = shift => {
    this.props.onWeekChange(shift);
  };

  render() {
    return (
      <div className="week-change-buttons">
        <button onClick={() => this.changeOfWeek(-604800000)}>Previous Week</button>
        <button onClick={() => this.changeOfWeek(604800000)}>Next Week</button>
      </div>
    );
  }
}

export default WeekChangeButtons;
