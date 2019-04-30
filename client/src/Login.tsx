import React, { Component } from 'react';
import axios from 'axios';
import {IAuthProps,IAuthState} from './react-app-env';

export default class Login extends Component<IAuthProps,IAuthState> {
    constructor(props: IAuthProps) {
        super(props)
        this.state = {
            email: '',
            password: '',
            message: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e: React.FormEvent) { 
        console.log('Logging in...')
        e.preventDefault()
        axios.post('/auth/login', { 
            email: this.state.email,
            password: this.state.password
        }).then( res => {
            if (res.data.type === 'error') {
                this.setState({
                    message: res.data.message
                })
            } else {
                localStorage.setItem('jwtToken', res.data.token)
                this.props.liftToken(res.data)
            }
        }).catch( err => {
            let message;
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                message = `${err.response.status}: ${err.response.data.message || err}`
            } else if (err.request) {
                // The request was made but no response was received
                console.log(err.request)
                message = '404: server not found'
            } else {
                // Something happened in setting up the request that triggered an Error
                message = 'Error: ' + err.message
            }
            this.setState({ message })
        });
    }
    render() {
        return(
            <div className="login">
                <h3>Log in to your account</h3>
                <form onSubmit={ this.handleSubmit } >
                    <input onChange={this.handleInputChange} value={this.state.email}type="email" name="email" placeholder="Enter your email..."/>
                    <input onChange={this.handleInputChange} value={this.state.password} type="password" name="password" placeholder="Enter your password..."/>
                    <input type="submit" value="Log In!"/>
                </form>
            </div>
        )
    }
}