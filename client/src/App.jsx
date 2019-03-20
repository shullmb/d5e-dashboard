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
      errorMessage: '',
      lockedResult: ''
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
  }

  liftTokenToState({token, user}) {
    this.setState({token, user})
  }

  logout() {
    // Remove the token from localStorage
    localStorage.removeItem('jwtToken')
    // Remove the user and token from state
    this.setState({
      token: '',
      user: null
    })
  }

  handleClick(e) {
    e.preventDefault()
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`
    axios.get('/locked/test').then( res => {
      this.setState({
        lockedResult: res.data
      })
    })
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
    let user = this.state.user
    let content
    if (user) {
      content = (
      <>    
        <div className="profile-box">  
          <UserProfile user={ user } logout={ this.logout }/>
          <p><a onClick={ this.handleClick }>Test the protected route...</a></p>
          <p>{ this.state.lockedResult }</p>
      </div>
      </>
      )
    } else {
      content = (
        <div className="authenticate">
          <Signup liftToken={this.liftTokenToState} />
          <Login liftToken={this.liftTokenToState} />
        </div>
      )
    }
    return (
      <div className="App">
        <header><h1>Welcome to my site!</h1></header>
        {content}
      </div>
    )
  }
}

export default App;
