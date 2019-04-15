/// <reference types="react-scripts" />

export interface IAppState {
  token?: any;
  user?: any;
  message?: any;
  lockedResult?: any;
}
export interface IAppProps {
  user?: any;
  logout?:() => void;
}

export interface IAuthState {
  name?: string;
  email?: string;
  password?: string;
  message?: string;
}

export interface IAuthProps {
  liftToken: ({ token, user, message }: { token: any; user: any; message: any; }) => void;
}

export interface IProfileProps {
  user: any;
  logout?: () => void
}