import { List, SxProps } from '@mui/material';
import { IChat } from 'src/@types/communication';
import { SkeletonConversationItem } from '../../../../components/skeleton';
import useResponsive from '../../../../hooks/useResponsive';
import ChatNavItem from './ChatNavItem';

type Props = {
  chats?: IChat[];
  openNav: boolean;
  onCloseNav: VoidFunction;
  selected: (chatId: string) => boolean;
  onSelectChat: (chat: IChat) => void;
  sx?: SxProps;
};

export default function ChatNavList({
  chats,
  openNav,
  onCloseNav,
  selected,
  onSelectChat,
  sx,
  ...other
}: Props) {
  const isDesktop = useResponsive('up', 'md');
  const loading = !chats;

  return (
    <List disablePadding sx={sx} {...other}>
      {(loading ? [...Array(12)] : chats).map((chat: IChat, index) =>
        chat?.chat_id ? (
          <ChatNavItem
            key={chat.chat_id}
            openNav={openNav}
            chat={chat}
            isClosed={!!(chat.closed && chat.closed_by)}
            isSelected={selected(chat.chat_id)}
            onSelect={() => {
              if (!isDesktop) {
                onCloseNav();
              }
              onSelectChat(chat);
            }}
          />
        ) : (
          <SkeletonConversationItem key={index} />
        )
      )}
    </List>
  );
}
