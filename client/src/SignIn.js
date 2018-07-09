import React from 'react';
// import { Link } from 'react-router-dom';

const SignIn = props => (
  <form onSubmit={props.signInUser}>
    <input
      type="text"
      name="username"
      placeholder="Your username…"
      value={props.author}
      onChange={props.handleChangeText}
    />
    <input
      type="password"
      name="password"
      placeholder="Password..."
      value={props.text}
      onChange={props.handleChangeText}
    />
    <button type="submit">Sign In</button>
  </form>
);

export default SignIn;