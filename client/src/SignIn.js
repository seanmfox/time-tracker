import React, { Component } from 'react';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
    error: null
  }

  signInUser = (e) => {
    e.preventDefault()
    const { email, password } = this.state;
    if (!email || !password) return;
      this.newSignIn();
  }

  newSignIn = () => {
    const { email, password } = this.state;
    fetch('/api/usersignin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }).then(res => res.json()).then((res) => {
      if (!res.success) this.setState({ error: res.error.message || res.error });
      else if (res.userRole) {
        localStorage.userId = res.userId
        localStorage.userRole = res.userRole
        this.props.setUserRole(res.userRole)
      };
    });
  }

  onChangeText = (e) => {
    const newState = { ...this.state };
    newState[e.target.name] = e.target.value;
    this.setState(newState);
  }

  render() {
    const { email, password, error } = this.state
    if (error) {
      const messages = document.querySelector('.messages');
      messages.classList.add('error-alert');
      messages.innerHTML = `<p class="error-message">${error}<p>`;
    }

    return (
      <div className="signin-form-container">
        <div className="messages">

        </div>
        <form className="signin-form" onSubmit={(e) => this.signInUser(e)}>
          <input
            id="signin-email-input"
            className="signin-input"
            type="text"
            name="email"
            placeholder="Email"
            value={email}
            onChange={this.onChangeText}
            required
          />
          <input
            id="signin-password-input"
            className="signin-input"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={this.onChangeText}
            required
          />
          <button type="submit" className="full-width-button">Log In</button>
        </form>
      </div>
    );
  }
}

export default SignIn;