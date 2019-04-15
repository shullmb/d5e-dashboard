import React from 'react';
import { IProfileProps } from './react-app-env';

export default function UserProfile(props: IProfileProps) {
    return (
        <div className="UserProfile">
            <p>Hello, {props.user.name} </p>
            <a onClick={ props.logout }>Log Out!</a> 
        </div>
    )
} 