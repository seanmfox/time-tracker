import React from 'react';

const UserForm = props => (
  <div className="user-signup-form-container">
    <form className="user-signup-form" onSubmit={props.submitUser}>
      <input
        type="text"
        name="fname"
        placeholder="First Name"
        value={props.fname}
        onChange={props.handleChangeText}
        required
      />
      <input
        type="text"
        name="lname"
        placeholder="Last Name"
        value={props.lname}
        onChange={props.handleChangeText}
        required
      /> 
      <input
        className="user-signup-email"
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
      <input
        type="password"
        name="verifyPassword"
        placeholder="Verify password"
        value={props.verifyPassword}
        onChange={props.handleChangeText}
        required
      />

      <button type="submit">Sign Up</button>
    </form>
  </div>
);

export default UserForm;