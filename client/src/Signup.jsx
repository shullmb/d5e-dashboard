import React, { Component } from 'react';
import axios from 'axios';

export default class Signup extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
        }

        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleEmailChange = this.handleEmailChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
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
        axios.post('/auth/signup', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }).then( res => {
            if (res.data.type === 'error') {
                console.log('error', res.data)
            } else {
                sessionStorage.setItem('jwtToken', res.data.token)
                localStorage.setItem('jwtToken', res.data.token)
                this.props.liftToken(res.data)

            }
        })
    }
    render() {
        return (
            <div className="signup">
                <h3>Create a new account: </h3>
                <form onSubmit={this.handleSubmit} >
                    <input onChange={this.handleNameChange} value={this.state.name} type="text" name="name" placeholder="Enter your full name"/>
                    <input onChange={this.handleEmailChange} value={this.state.email} type="email" name="email" placeholder="Enter your email address"/>
                    <input onChange={this.handlePasswordChange} value={this.state.password} type="password" name="password" placeholder="Choose a password..."/>
                </form>
            </div>
        )
    }
}