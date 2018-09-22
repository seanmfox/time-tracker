import React, { Component } from "react";
import Dashboard from "./Dashboard";
import SignUp from "./SignUp";
import "whatwg-fetch";
import { Route, Redirect } from "react-router-dom";
import HomePage from "./HomePage";
import "../styles/App.css";
import Header from "./Header";
import Footer from "./Footer";
import Admin from "./Admin";
import Settings from "./Settings"
import { userAuth } from "../lib/DBAPI";

class App extends Component {
  state = {
    user: "",
    error: null,
    weekStart: ""
  };

  componentDidMount() {
    this.localStorageUpdate();
    this.setCurrentWeek();
  }

  localStorageUpdate = () => {
    if (localStorage.getItem("JWT") && this.state.user === "") {
      this.authenticateUser();
    }
  };

  async authenticateUser() {
    let res = await userAuth();
    if (!res.success) this.setState({ error: res.error });
    else this.setState({ user: res });
  }

  setCurrentWeek = () => {
    const currentDate = new Date(Date.now());
    const weekBeginningDate =
      currentDate.getUTCDate() - currentDate.getUTCDay();
    const startOfDay = new Date(currentDate.setUTCDate(weekBeginningDate));
    startOfDay.setUTCHours(0, 0, 0, 0);
    this.setState({ weekStart: startOfDay.valueOf() });
  };

  changeWeek = shift => {
    this.setState(prevState => ({ weekStart: prevState.weekStart + shift }));
  };

  setUser = user => {
    this.setState({ user });
  };

  render() {
    const { user, weekStart } = this.state;

    return (
      <div className="app">
        <Header />
        <Route
          path="/settings"
          render={() =>
            Object.keys(localStorage.getItem("JWT")).length > 0 ? <Settings 
              user={user}/> : <Redirect to="/" />
          }
        />
        <Route
          exact
          path="/"
          render={() =>
            user.userRole === "admin" ? (
              <Redirect to="/admin" />
            ) : user.userRole === "student" ? (
              <Redirect to="/dashboard" />
            ) : (
              <HomePage validUser={user => this.setUser(user)} />
            )
          }
        />
        <Route
          path="/admin"
          render={() =>
            user.userRole === "admin" ? (
              <Admin
                validUser={user => this.setUser(user)}
                onWeekChange={timeChange => this.changeWeek(timeChange)}
                weekStart={weekStart}
                userRole={user.userRole}
                user={user}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route
          path="/dashboard"
          render={() =>
            user.userRole === "student" ? (
              <Dashboard
                validUser={user => this.setUser(user)}
                onChangeWeek={timeChange => this.changeWeek(timeChange)}
                weekStart={weekStart}
                user={user}
              />
            ) : (
              <Redirect to="/" />
            )
          }
        />
        <Route path="/signup" render={() => <SignUp user={user} />} />
        <Footer />
      </div>
    );
  }
}

export default App;
