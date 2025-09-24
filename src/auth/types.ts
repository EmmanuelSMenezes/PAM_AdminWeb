import { HubConnection } from '@microsoft/signalr';
import { Dispatch, SetStateAction } from 'react';
import { IUser } from 'src/@types/user';

export type AuthUserType = null | Record<string, any>;

export type AuthStateType = {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: AuthUserType;
};

export type JWTContextType = {
  method: string;
  isAuthenticated: boolean;
  isInitialized: boolean;
  temporaryPassword: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setTemporaryPassword: Dispatch<SetStateAction<boolean>>;
  signalRConnection?: HubConnection;
  signalRStyleConnection?: HubConnection;
  token: string;
  user: AuthUserType;
  setUser: (user: any) => void;
  login: (email: string, password: string) => Promise<void | IUser>;
  logout: () => void;
  loginWithGoogle?: () => void;
  loginWithGithub?: () => void;
  loginWithTwitter?: () => void;
};
