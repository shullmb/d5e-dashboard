import React, { Component } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import UserProfile from './UserProfile';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: '',
      user: null,
      email: '',
      errorMessage: '',
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
  }

  liftTokenToState({token, user}) {
    this.setState({token, user})
  }

  checkForLocalToken() {
    let token = localStorage.getItem('jwtToken')
    if (!token || token === 'undefined') {
      // If there is no token, remove the entry in localStorage
      localStorage.removeItem('jwtToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      // If found, send token to be verified
      axios.post('/auth/me/from/token')
      .then( res => {
        if (res.data.type === 'error') {
          console.log('error', res.data)
          // if error, remove the bad token and display an error
          localStorage.removeItem('jwtToken')
          this.setState({
            errorMessage: res.data.message
          })
        } else {
          // Upon receipt, store token 
          localStorage.setItem('jwtToken', res.data.token)
          // Put token in state
          this.setState({
            token: res.data.token,
            user: res.data.user
          })
        }
        console.log(res)
      }).catch( err => {
        console.log(err)
      })
    }
  }
  componentDidMount() {
    this.checkForLocalToken()
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
