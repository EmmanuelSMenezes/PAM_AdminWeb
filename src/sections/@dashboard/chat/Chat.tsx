import { Icon } from '@iconify/react';
import { Card, Container, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/useAuthContext';
import Iconify from 'src/components/iconify';
import { useChatContext } from 'src/hooks/useChatContext';
import uuidv4 from 'src/utils/uuidv4';
import { IChat } from '../../../@types/communication';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { getConversations, updateChat, updateMessage } from '../../../redux/slices/chat';
import { PATH_DASHBOARD } from '../../../routes/paths';
import ChatHeaderCompose from './header/ChatHeaderCompose';
import ChatMessageInput from './message/ChatMessageInput';
import ChatMessageList from './message/ChatMessageList';
import ChatNav from './nav/ChatNav';

export default function Chat() {
  const { themeStretch } = useSettingsContext();
  const { signalRChatConnection, preSelectedChat, setPreSelectedChat } = useChatContext();
  const { user, token } = useAuthContext();
  const [chats, setChats] = useState<IChat[]>([] as IChat[]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<IChat>();
  const router = useRouter();


  const membersSelectedChat = user?.isCollaborator
    ? selectedChat?.membersProfile?.filter((member) => member?.user_id !== user?.sponsor_id)
    : selectedChat?.membersProfile?.filter((member) => member?.user_id !== user?.user_id);

  const getAllConversations = useCallback(async () => {
    try {
      const response = await getConversations(
        user?.isCollaborator ? user?.sponsor_id : user?.user_id
      );
      if (selectedChat || preSelectedChat) {
        const newSelectedChat = response.filter(
          (chat: IChat) =>
            chat.chat_id === selectedChat?.chat_id || chat.chat_id === preSelectedChat
        )[0];
        setSelectedChat(newSelectedChat);
        setPreSelectedChat(undefined)
        
      }
      if (router.asPath === '/dashboard/chat/?previous') {
        setPreSelectedChat(undefined);
        setSelectedChat(undefined);
      }

      const orderedChat = response?.sort((x: any, y: any) => {
        const dateX = new Date(x?.lastMessage?.created_at).getTime();
        const dateY = new Date(y?.lastMessage?.created_at).getTime();
        return dateY - dateX;
      });
      setChats(orderedChat);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getAllConversations();
  }, []);

  useEffect(() => {
    if (signalRChatConnection && chats?.length && signalRChatConnection.state === 'Connected') {
      chats?.forEach((chat) => {
        if (!chat.closed && !chat.closed_by) {
          signalRChatConnection.invoke('JoinChat', chat.chat_id);
        }
      });
    }
  }, [signalRChatConnection, chats]);

  useEffect(() => {
    if (
      signalRChatConnection &&
      chats?.length &&
      signalRChatConnection.state === 'Connected' &&
      selectedChat
    ) {
      if (
        selectedChat &&
        selectedChat?.unReadCountMessages &&
        selectedChat?.unReadCountMessages > 0
      ) {
        selectedChat.messages
          .filter((message) => {
            if (user?.isCollaborator) {
              return !message?.read_at && message?.sender_id !== user?.sponsor_id;
            }
            return !message?.read_at && message?.sender_id !== user?.user_id;
          })
          .forEach((message) => {
            message.read_at = new Date();
            message.chat_id = selectedChat.chat_id;
            updateMessage(message);
          });
        // getAllConversations();
      }
    }
  }, [selectedChat]);

  const handleSendMessage = useCallback(
    async (message?: string) => {
      try {
        console.info('[WS]: Send Message', message);
        signalRChatConnection?.invoke(
          'SendMessageToEspecificChat',
          selectedChat?.chat_id,
          user?.isCollaborator ? user?.sponsor_id : user?.user_id,
          JSON.stringify({
            content: message,
            chat_id: selectedChat?.chat_id,
            read_at: null,
            created_at: new Date(),
            sender_id: user?.isCollaborator ? user?.sponsor_id : user?.user_id,
            message_id: uuidv4(),
            messageTypeTag: 'TEXT',
          }),
          `Bearer ${token}`
        );
      } catch (error) {
        console.error(error);
      }
    },
    [selectedChat]
  );

  useEffect(() => {
    if (selectedChat && chats?.length) {
      const chatsExcludedCurrent = chats?.map((chat) =>
        chat?.chat_id !== selectedChat?.chat_id ? chat : null
      );
      const newChats = chatsExcludedCurrent.map((chat) => chat || selectedChat);
      setChats(newChats);
    }
  }, [selectedChat]);

  const handleEndChat = async () => {
    try {
      signalRChatConnection?.invoke('LeaveChat', selectedChat?.chat_id);
      await updateChat({
        chat_id: selectedChat?.chat_id,
        closed_by: user?.isCollaborator ? user?.sponsor_id : user?.user_id,
      });
      // setSelectedChat(undefined);
      // await getAllConversations();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickSelectChat = (chat: IChat) => setSelectedChat(chat);
  const chatId = selectedChat?.chat_id;
  useEffect(() => {
    if (signalRChatConnection && signalRChatConnection.state === 'Connected') {
      signalRChatConnection.on('ReceiveMessage', (user_id, newMessage) => {
        console.info('[WS]: Received Message');
        const message = JSON.parse(newMessage);

        if (chatId === message.chat_id) {
          const chatMessage = chats.filter((chat) => chat.chat_id === message.chat_id)[0];
          const newChat = {
            ...chatMessage,
            messages: [
              ...chatMessage.messages,
              { ...message, messageType: message?.messageTypeTag },
            ],
            lastMessage: { ...message, messageType: message?.messageTypeTag },
          };
          setSelectedChat(newChat);
          setChats((oldChats) => [
            newChat,
            ...oldChats.filter((oldChat) => oldChat.chat_id !== newChat.chat_id),
          ]);
        } else {
          setChats((oldChats) => {
            const chatMessage = oldChats.filter((chat) => chat.chat_id === message.chat_id)[0];
            const newChat = {
              ...chatMessage,
              messages: [
                ...chatMessage.messages,
                { ...message, messageType: message?.messageTypeTag },
              ],
              lastMessage: { ...message, messageType: message?.messageTypeTag },
            };
            return [newChat, ...oldChats.filter((oldChat) => oldChat.chat_id !== newChat.chat_id)];
          });
        }
      });
      signalRChatConnection.on('RefreshChatList', async (chat) => {
        console.info(`[WS - ON]: Status Received.`);
        setChats((old) => [JSON.parse(chat), ...old]);
      });
    }
  }, [signalRChatConnection, selectedChat]);

  const MessageList = useCallback(
    () => <ChatMessageList chat={selectedChat} />,
    [selectedChat, chats]
  );

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading="Chat"
        links={[
          {
            name: 'Dashboard',
            href: PATH_DASHBOARD.root,
          },
          { name: 'Chat' },
        ]}
      />

      <Card sx={{ height: '72vh', display: 'flex' }}>
        <ChatNav
          chats={chats}
          activeChatId={selectedChat?.chat_id}
          onSelectChat={(chat: any) => handleClickSelectChat(chat)}
        />

        {isLoading ? (
          <div
            style={{
              display: 'flex',
              width: '1250%',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '40px 0px',
            }}
          >
            <Icon icon="eos-icons:bubble-loading" width="90" height="90" />
          </div>
        ) : (
          <>
            {selectedChat ? (
              <Stack flexGrow={1} sx={{ overflow: 'hidden' }}>
                <ChatHeaderCompose
                  members={membersSelectedChat}
                  chat={selectedChat}
                  handleEndChat={handleEndChat}
                />
                <Stack
                  direction="row"
                  flexGrow={1}
                  sx={{
                    overflow: 'hidden',
                    borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Stack flexGrow={1} sx={{ minWidth: 0 }}>
                    <MessageList />

                    {!selectedChat.closed && !selectedChat.closed_by && (
                      <ChatMessageInput
                        conversationId={selectedChat.chat_id}
                        handleSendMessage={handleSendMessage}
                        disabled={!!selectedChat.closed}
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
            ) : (
              <Stack
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                width="100%"
                gap="35px"
              >
                <Iconify icon="tabler:message-x" width={140} />
                Nenhum Chat Selecionado.
              </Stack>
            )}
          </>
        )}
      </Card>
    </Container>
  );
}
