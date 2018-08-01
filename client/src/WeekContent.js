import React, { Component } from "react";
import WeekChangeButtons from "./WeekChangeButtons";
import WeeklyRecap from "./WeeklyRecap";
import ActivityList from "./ActivityList";

class WeekContent extends Component {
  changeOfWeek = shift => {
    this.props.onWeekChange(shift);
  };

  updateActivities = () => {
    this.props.onActivityUpdate();
  };

  render() {
    const { weekStart, activities, userId, userRole } = this.props;

    return (
      <div className="week-content">
        <WeekChangeButtons onWeekChange={shift => this.changeOfWeek(shift)} />
        <WeeklyRecap
          activities={activities}
          weekStart={weekStart}
          userRole={userRole}
        />
        <ActivityList
          userId={userId}
          userRole={userRole}
          activities={activities}
          weekStart={weekStart}
          onActivityUpdate={() => this.updateActivities()}
        />
      </div>
    );
  }
}

export default WeekContent;
