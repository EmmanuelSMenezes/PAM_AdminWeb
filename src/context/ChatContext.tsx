import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import React, { createContext, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import { BadgeStatusValue } from 'src/components/badge-status';
import { HOST_API_COMMUNICATION } from 'src/config-global';

interface IChatContext {
  status: BadgeStatusValue;
  usersStatus: IStatus[];
  updateStatus: (status: BadgeStatusValue) => void;
  setUsersStatus: (status: IStatus[]) => void;
  signalRChatConnection?: HubConnection;
  setSignalRChatConnection: (connection: HubConnection) => void;
  preSelectedChat?: string;
  setPreSelectedChat: (chatId?: string) => void;
}

interface IStatus {
  User_id: string;
  Status: BadgeStatusValue;
}

const ChatContext = createContext<IChatContext>({} as IChatContext);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [signalRChatConnection, setSignalRChatConnection] = useState<HubConnection | undefined>();
  const [status, updateStatus] = useState<BadgeStatusValue>('invisible');
  const { user, token } = useAuthContext();
  const [usersStatus, setUsersStatus] = useState<IStatus[]>([] as IStatus[]);
  const [preSelectedChat, setPreSelectedChat] = useState<string | undefined>();


  const createHubConnectionSignalR = async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${HOST_API_COMMUNICATION}chat-hub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();
    await newConnection.start();
    setSignalRChatConnection(newConnection);
  };

  useEffect(() => {
    createHubConnectionSignalR();
  }, []);

  useEffect(() => {
    if (signalRChatConnection && user && token) {
      signalRChatConnection.on('RefreshStatus', (statuses) => {
        console.info(`[WS - ON]: Status Received.`);
        JSON.parse(statuses).forEach((stats: IStatus) => {
          if (stats.User_id === user?.isCollaborator ? user?.sponsor_id : user?.user_id) {
            updateStatus(stats.Status);
          }
        });
        setUsersStatus(JSON.parse(statuses));
      });
      signalRChatConnection.invoke('JoinCommunicationChannel', user?.isCollaborator ? user?.sponsor_id : user?.user_id)
    }
  }, [signalRChatConnection]);

  useEffect(() => {
    if (signalRChatConnection && user && token) {
      console.info(`[WS - INVOKE]: RefreshStatus.`);
      signalRChatConnection.invoke('RefreshStatus', user?.isCollaborator ? user?.sponsor_id : user?.user_id, status);
    }
  }, [signalRChatConnection, updateStatus, status]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    status,
    updateStatus,
    usersStatus,
    setUsersStatus,
    signalRChatConnection,
    setSignalRChatConnection,
    preSelectedChat, 
    setPreSelectedChat
  };
  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};

export { ChatContext, ChatProvider };
