import React, { Component } from 'react';
import './App.css';
import Signup from './Signup';
import Login from './Login';
import UserProfile from './UserProfile';
import axios from 'axios';
import {IAppProps, IAppState} from './react-app-env';

class App extends Component<IAppProps,IAppState> {
  constructor(props: IAppProps) {
    super(props)
    this.state = {
      token: '',
      user: null,
      message: '',
      lockedResult: ''
    }
    this.liftTokenToState = this.liftTokenToState.bind(this)
    this.checkForLocalToken = this.checkForLocalToken.bind(this)
    this.logout = this.logout.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  liftTokenToState({token, user, message} : IAppState) {
    this.setState({token, user, message})
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

  handleClick(e: React.MouseEvent) {
    e.preventDefault()
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.state.token}`
    axios.get('/locked/test').then( res => {
      console.log('this is the locked response', res)
      this.setState({
        lockedResult: res.data.message
      })
    }).catch(err => {
      console.log('err')
    })
  }

  checkForLocalToken() {
    let token = localStorage.getItem('jwtToken')
    if (!token || token === 'undefined') {
      localStorage.removeItem('jwtToken')
      this.setState({
        token: '',
        user: null
      })
    } else {
      axios.post('/auth/me/from/token',{token})
      .then( res => {
        if (res.data.type === 'error') {
          localStorage.removeItem('jwtToken')
          this.setState({
            message: res.data.message
          })
        } else {
          localStorage.setItem('jwtToken', res.data.token)
          this.setState({
            token: res.data.token,
            user: res.data.user
          })
        }
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
          <Signup liftToken={this.liftTokenToState}  />
          <Login liftToken={this.liftTokenToState}  />
        </div>
      )
    }
    return (
      <div className="App">
        <header><h1>Welcome to my site!</h1></header>
        <h3>{ this.state.message }</h3>
        {content}
      </div>
    )
  }
}

export default App;
