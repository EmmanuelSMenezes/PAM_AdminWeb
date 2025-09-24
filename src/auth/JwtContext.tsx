import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/router';
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { HOST_API_COMMUNICATION } from 'src/config-global';
import { PATH_AUTH } from 'src/routes/paths';
import { createSession } from 'src/service/auth';
import localStorageAvailable from '../utils/localStorageAvailable';
import { AuthUserType, JWTContextType } from './types';
import { isValidToken, setSession } from './utils';


const AuthContext = createContext<JWTContextType | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

function AuthProvider({ children }: AuthProviderProps) {
  const [signalRConnection, setSignalRConnection] = useState<HubConnection | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [temporaryPassword, setTemporaryPassword] = useState<boolean>(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState({} as AuthUserType);
  const { replace } = useRouter();

  const storageAvailable = localStorageAvailable();

  const initialize = useCallback(async () => {
    try {
      const accessToken = storageAvailable ? localStorage.getItem('accessToken') : '';
      const userInitial = storageAvailable ? localStorage.getItem('@PAM:user') : '';
      if (userInitial && accessToken && isValidToken(accessToken)) {
        setSession(accessToken);
        setIsAuthenticated(true);
        setToken(accessToken);
        setUser(JSON.parse(userInitial));
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error(error);
      setIsInitialized(false);
    } finally {
      setIsInitialized(true);
    }
  }, [storageAvailable]);


  const createHubConnectionSignalR =  useCallback(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_COMMUNICATION}core-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
     newConnection.start();
    setSignalRConnection(newConnection);
  }, [])


  useEffect(()=> {
    createHubConnectionSignalR();
  }, [])
  
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (signalRConnection && user && token) {
      console.info('[WS] - Core Connected')
      signalRConnection.on('DisconnectUser', (userId) => {
        if(userId === user?.user_id){
          try {
            logout();
            replace(PATH_AUTH.login);
          } catch (error) {
            console.error(error);
          }
        }
      });
    }
  }, [signalRConnection, user]);

  // LOGIN
  const login = useCallback(async (email: string, password: string) => {
    const response = await createSession(email, password);
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('@PAM:user', JSON.stringify(response.user));

    if (response.user.password_generated === true && response?.user?.isActiveCollaborator && response?.user?.isCollaborator) {
      setSession(response.token);
      return setTemporaryPassword(true);
    } 
    if (response?.user?.isCollaborator === true && response?.user?.isActiveCollaborator === false){
      return response;
    } 

    setSession(response.token);
    setIsAuthenticated(true);
    return response
  }, []);
  
  const logout = useCallback(() => {
    setSession(null);
    setUser({});
    setIsAuthenticated(false);
    setTemporaryPassword(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('@PAM:user');
    localStorage.removeItem('GeneralStyle');
  }, []);

  const memoizedValue = useMemo(
    () => ({
      isInitialized,
      isAuthenticated,
      temporaryPassword,
      setTemporaryPassword,
      signalRConnection,
      user,
      setUser,
      token,
      method: 'jwt',
      login,
      loginWithGoogle: () => {},
      loginWithGithub: () => {},
      loginWithTwitter: () => {},
      logout,
      setIsAuthenticated,
    }),
    [isAuthenticated, signalRConnection, isInitialized, user, login, logout, token, temporaryPassword, setTemporaryPassword]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
