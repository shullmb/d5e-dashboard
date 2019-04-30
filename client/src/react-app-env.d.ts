/// <reference types="react-scripts" />

export interface IUser {
  _id: string;
  name: string;
  email: string;
}

export interface IAppState {
  token?: string;
  user?: IUser | null;
  message?: string;
  lockedResult?: string;
}

export interface IAppProps {
  user?: IUser;
}

export interface IAuthState {
  name?: string;
  email?: string;
  password?: string;
  message?: string;
}

export interface ILiftToken { 
  token: string; 
  user: IUser; 
  message: string; }

export interface IAuthProps {
  liftToken: (ILiftToken) => void;
}

export interface IProfileProps {
  user: IUser;
  logout?: () => void
}