export const dbRemoveActivity = (userId, activityId) =>
  fetch(`/api/users/${userId}/activities/${activityId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    // body: JSON.stringify({ userId })
  }).then(res => res.json());

export const userData = () => fetch("/api/userdata/").then(data => data.json());

export const createNewActivity = (
  activityType,
  time,
  userId,
  date,
  description
) =>
  fetch(`/api/users/${userId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityType, time, date, description })
  }).then(res => res.json());

export const loadUserActivities = userId =>
  fetch(`/api/users/${userId}/activities`).then(data => data.json());

export const userAuth = () =>
  fetch(`/api/authenticateuser/${localStorage.getItem("userId")}`).then(data =>
    data.json()
  );

export const userSignIn = (email, password) =>
  fetch("/api/usersignin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());

export const loadUserList = () =>
  fetch("/api/users/").then(data => data.json());

export const createNewUser = (fname, lname, email, password) =>
  fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fname, lname, email, password })
  }).then(res => res.json());
