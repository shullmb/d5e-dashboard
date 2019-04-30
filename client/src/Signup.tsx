import React, { Component } from 'react';
import axios from 'axios';
import {IAuthProps, IAuthState} from './react-app-env';

export default class Signup extends Component<IAuthProps,IAuthState> {
    constructor(props: IAuthProps) {
        super(props)
        this.state = {
            name: '',
            email: '',
            password: '',
            message: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleInputChange(e: any) {
        this.setState({ 
            [e.target.name]: e.target.value 
        });
    }

    handleSubmit(e: any) {
        console.log('signing up...')
        e.preventDefault()
        axios.post('/auth/signup', {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password
        }).then( res => {
            console.log('res.data', res.data)
            if (res.data.type === 'error') {
                console.log('error', res.data)
                this.setState({
                    message: res.data.message
                })
            } else {
                localStorage.setItem('jwtToken', res.data.token)
                this.props.liftToken(res.data)

            }
        }).catch(err => {
            console.log(err)
        });
    }
    render() {
        console.log('rendering signup')
        return (
            <div className="signup">
                <h3>Create a new account: </h3>
                <form onSubmit={this.handleSubmit} >
                    <input onChange={this.handleInputChange} value={this.state.name} type="text" name="name" placeholder="Enter your full name"/>
                    <input onChange={this.handleInputChange} value={this.state.email} type="email" name="email" placeholder="Enter your email address"/>
                    <input onChange={this.handleInputChange} value={this.state.password} type="password" name="password" placeholder="Choose a password..."/>
                    <input type="submit" value="Sign Up!"/>
                </form>
            </div>
        )
    }
}