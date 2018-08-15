export async function dbRemoveActivity(userId, activityId) {
  return fetch(`/api/users/${userId}/activities/${activityId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  }).then(res => res.json());
}

export async function userData() {
  return fetch("/api/userdata/").then(data => data.json());
}

export async function createNewActivity(
  activityType,
  time,
  userId,
  date,
  description
) {
  return fetch(`/api/users/${userId}/activities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityType, time, date, description })
  }).then(res => res.json());
}

export async function loadUserActivities(userId) {
  return fetch(`/api/users/${userId}/activities`).then(data => data.json());
}

export async function userAuth() {
  return fetch(`/api/authenticateuser/${localStorage.getItem("userId")}`).then(
    data => data.json()
  );
}

export async function userSignIn(email, password) {
  return fetch("/api/usersignin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
}

export async function loadUserList() {
  return fetch("/api/users/").then(data => data.json());
}

export async function createNewUser(fname, lname, email, password) {
  return fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fname, lname, email, password })
  }).then(res => res.json());
}
