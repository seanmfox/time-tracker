import React from 'react';

const UserForm = props => (
  <form onSubmit={props.submitUser}>
    <input
      type="text"
      name="username"
      placeholder="Your username…"
      value={props.username}
      onChange={props.handleChangeText}
    />
    <input
      type="password"
      name="password"
      placeholder="Password..."
      value={props.password}
      onChange={props.handleChangeText}
    />
    <button type="submit">Create New User</button>
  </form>
);

export default UserForm;