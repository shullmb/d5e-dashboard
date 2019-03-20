import React, { Component } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import UserProfile from './UserProfile';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      email: '',
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
  }
  liftTokenToState({token, user}) {
    this.setState({token, user})
  }
  render() {
    return (
      <div className="App">
      <p>I AM THE APP</p>
      <p>Value of this.state.token: {this.state.token} </p>
      <Signup liftToken={this.liftTokenToState} />
      <Login liftToken={this.liftTokenToState} />
      </div>
    );
  }
}

export default App;
