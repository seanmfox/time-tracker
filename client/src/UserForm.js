import React from 'react';

const UserForm = props => (
  <form onSubmit={props.submitUser}>
    <input
      type="email"
      name="email"
      placeholder="Email Address"
      value={props.email}
      onChange={props.handleChangeText}
      required
    />
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={props.password}
      onChange={props.handleChangeText}
      required
    />
    <button type="submit">Create New User</button>
  </form>
);

export default UserForm;