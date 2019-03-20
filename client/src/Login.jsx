import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            message: ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleEmailChange(e) {
        this.setState({
            email: e.target.value
        })
    }
    handlePasswordChange(e) {
        this.setState({
            password: e.target.value
        })
    }
    handleSubmit(e) {
        console.log('Logging in...')
        e.preventDefault()
        axios.post('/auth/login', {
            email: this.state.email,
            password: this.state.password
        }).then( res => {
            if (res.data.type === 'error') {
                console.log(res.status, res.data)
                this.setState({
                    message: res.data.message
                })
            } else {
                console.log(res.status, res.data)
                sessionStorage.setItem('jwtToken', res.data.token)
                localStorage.setItem('jwtToken', res.data.token)
                this.props.liftToken(res.data)
                this.setState({
                    message: ''
                })
            }
        }).catch( err => {
            console.log(err)
        })
    }
    render() {
        return(
            <div className="login">
                <h3>Log in to your account</h3>
                <form onSubmit={ this.handleSubmit } >
                    <input onChange={this.handleEmailChange} value={this.state.email}type="email" name="email" placeholder="Enter your email..."/>
                    <input onChange={this.handlePasswordChange} value={this.state.password} type="password" name="password" placeholder="Enter your password..."/>
                    <input type="submit" value="Log In!"/>
                </form>
            </div>
        )
    }
}